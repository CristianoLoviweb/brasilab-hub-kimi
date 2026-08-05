#!/usr/bin/env node
/**
 * Aplica as migrations SQL pendentes (drizzle/*.sql) no PostgreSQL.
 *
 * Regras (condicional nº 6):
 *  - migrations são aplicadas UMA VEZ, em ordem, dentro de transação;
 *  - o controle fica na tabela `_migrations` (ledger) — nada é reaplicado;
 *  - este script NUNCA apaga ou recria tabelas: ele apenas executa, em
 *    sequência, os arquivos SQL versionados em drizzle/.
 *
 * Uso: node scripts/migrate.mjs   (ou npm run db:migrate)
 * Variável: DATABASE_URL (padrão local: postgres://postgres:postgres@127.0.0.1:5432/brasilab)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, "../drizzle");

const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/brasilab";

async function waitForDatabase(client, attempts = 15) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await client.connect();
      return;
    } catch (error) {
      lastError = error;
      console.log(`Aguardando PostgreSQL... (tentativa ${attempt}/${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw lastError;
}

async function main() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("Nenhuma migration encontrada em drizzle/.");
    return;
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await waitForDatabase(client);
  console.log(`Conectado ao PostgreSQL (${files.length} migration(s) encontradas).`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  const appliedRows = await client.query("SELECT name FROM _migrations");
  const applied = new Set(appliedRows.rows.map((row) => row.name));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  = ${file} (já aplicada)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    console.log(`  + ${file} ...`);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Falha ao aplicar ${file}: ${error.message}`);
      process.exitCode = 1;
      break;
    }
  }

  await client.end();
  console.log("Migrations em dia.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
