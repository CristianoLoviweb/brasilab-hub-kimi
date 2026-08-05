import fs from "node:fs";
import path from "node:path";

/**
 * Configuração de ambiente do servidor (Sprint 03.2 — Infraestrutura).
 *
 * Todas as variáveis possuem valores padrão voltados ao ambiente local de
 * desenvolvimento; em produção elas são obrigatoriamente definidas via
 * ambiente (docker-compose / provedor). Nenhum segredo fica no repositório.
 *
 * O arquivo `.env` (quando presente na raiz) é lido aqui para o servidor —
 * sem dependências externas. Variáveis já definidas no ambiente têm
 * precedência sobre o arquivo.
 */

let dotEnvLoaded = false;

function loadDotEnv(): void {
  if (dotEnvLoaded) return;
  dotEnvLoaded = true;

  const file = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(file)) return;

  for (const rawLine of fs.readFileSync(file, "utf-8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

/** URL de conexão do PostgreSQL (único banco suportado — condicional nº 1). */
export function getDatabaseUrl(): string {
  loadDotEnv();
  return process.env["DATABASE_URL"] ?? "postgres://postgres:postgres@127.0.0.1:5432/brasilab";
}

/**
 * Diretório físico do storage de arquivos (condicional nº 5).
 * O banco registra SOMENTE o caminho relativo — nunca este diretório.
 */
export function getStorageDir(): string {
  loadDotEnv();
  const configured = process.env["STORAGE_DIR"] ?? "storage";
  return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
}

/** Tempo de vida da sessão em milissegundos (padrão: 8 horas). */
export function getSessionTtlMs(): number {
  loadDotEnv();
  const hours = Number(process.env["SESSION_TTL_HOURS"] ?? "8");
  return (Number.isFinite(hours) && hours > 0 ? hours : 8) * 60 * 60 * 1000;
}

/**
 * Marcar o cookie de sessão como Secure (HTTPS). Ativar em produção atrás
 * do proxy reverso com TLS; no ambiente local (HTTP) permanece falso.
 */
export function isCookieSecure(): boolean {
  loadDotEnv();
  return process.env["COOKIE_SECURE"] === "true";
}

/** Tamanho máximo de upload — espelha a regra do módulo de Leads (10 MB). */
export function getMaxUploadBytes(): number {
  loadDotEnv();
  const value = Number(process.env["MAX_UPLOAD_BYTES"] ?? String(10 * 1024 * 1024));
  return Number.isFinite(value) && value > 0 ? value : 10 * 1024 * 1024;
}
