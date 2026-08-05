import { defineConfig } from "drizzle-kit";

/**
 * Configuração do drizzle-kit (Sprint 03.2).
 *
 * - `npm run db:generate` gera uma nova migration SQL em drizzle/ a partir
 *   das mudanças do schema (src/server/db/schema.ts);
 * - `npm run db:migrate` aplica as migrations pendentes (scripts/migrate.mjs).
 *
 * As migrations geradas são sempre aditivas e versionadas — nenhuma delas
 * apaga ou recria tabelas automaticamente (condicional nº 6).
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/brasilab",
  },
});
