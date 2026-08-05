import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { getDatabaseUrl } from "../env";
import * as schema from "./schema";

/**
 * Conexão única com o PostgreSQL (Sprint 03.2).
 *
 * O Pool é guardado em `globalThis` para sobreviver ao hot-reload do Vite
 * em desenvolvimento sem abrir conexões duplicadas a cada recarga.
 */

type DrizzleClient = NodePgDatabase<typeof schema>;

const globalRef = globalThis as unknown as {
  __brasilabPgPool?: Pool;
  __brasilabDb?: DrizzleClient;
};

function createPool(): Pool {
  return new Pool({
    connectionString: getDatabaseUrl(),
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

export function getPool(): Pool {
  if (!globalRef.__brasilabPgPool) {
    globalRef.__brasilabPgPool = createPool();
  }
  return globalRef.__brasilabPgPool;
}

export function getDb(): DrizzleClient {
  if (!globalRef.__brasilabDb) {
    globalRef.__brasilabDb = drizzle(getPool(), { schema });
  }
  return globalRef.__brasilabDb;
}

export { schema };
