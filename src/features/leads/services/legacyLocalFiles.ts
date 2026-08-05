/**
 * Detecção de dados locais legados (Sprint 03.2 — condicional nº 4).
 *
 * Nas Sprints 03.1/Rev.01/Rev.02 os arquivos do Lead ficavam no IndexedDB
 * do navegador (base "brasilab-storage", store "lead-files") e os metadados
 * viviam apenas em memória. Com a migração para o servidor, este módulo:
 *
 *   1. DETECTA os dados existentes no navegador — sem abrir nem criar a
 *      base quando ela não existe;
 *   2. INFORMA ao usuário exatamente o que foi encontrado (ver o aviso em
 *      src/routes/_authenticated.tsx);
 *   3. NÃO migra automaticamente: os vínculos (Lead ↔ arquivo) existiam
 *      somente na memória do ambiente simulado e não sobrevivem — a
 *      migração automática não é possível e nada é regravado;
 *   4. NÃO remove nada: nenhuma rotina usa indexedDB.deleteDatabase,
 *      localStorage.clear() ou exclusões genéricas. A remoção é manual e
 *      exclusivamente autorizada pelo usuário.
 */

const LEGACY_DB_NAME = "brasilab-storage";
const LEGACY_STORE_NAME = "lead-files";

export interface LegacyLocalFilesReport {
  count: number;
  totalBytes: number;
}

async function databaseExists(): Promise<boolean> {
  if (typeof indexedDB === "undefined") return false;

  // Caminho preferencial: listar as bases existentes sem abrir nenhuma.
  if (typeof indexedDB.databases === "function") {
    try {
      const databases = await indexedDB.databases();
      return databases.some((db) => db.name === LEGACY_DB_NAME);
    } catch {
      // continua no plano B
    }
  }

  // Plano B: abrir e ABORTAR a criação — se a base não existir, o
  // onupgradeneeded dispara e o abort impede que ela seja criada.
  return new Promise((resolve) => {
    let existed = true;
    const request = indexedDB.open(LEGACY_DB_NAME);
    request.onupgradeneeded = () => {
      existed = false;
      request.transaction?.abort();
    };
    request.onsuccess = () => {
      request.result.close();
      resolve(existed);
    };
    request.onerror = () => resolve(existed);
    request.onblocked = () => resolve(false);
  });
}

/** Inventário dos arquivos legados (null quando não há nada a informar). */
export async function detectLegacyLocalFiles(): Promise<LegacyLocalFilesReport | null> {
  if (typeof indexedDB === "undefined") return null;
  if (!(await databaseExists())) return null;

  return new Promise((resolve) => {
    const request = indexedDB.open(LEGACY_DB_NAME);
    request.onerror = () => resolve(null);
    request.onsuccess = () => {
      const db = request.result;
      try {
        if (!db.objectStoreNames.contains(LEGACY_STORE_NAME)) {
          db.close();
          resolve(null);
          return;
        }
        const transaction = db.transaction(LEGACY_STORE_NAME, "readonly");
        const store = transaction.objectStore(LEGACY_STORE_NAME);
        const getAll = store.getAll();
        getAll.onsuccess = () => {
          const blobs = (getAll.result as unknown[]).filter(
            (item): item is Blob => item instanceof Blob,
          );
          db.close();
          if (blobs.length === 0) {
            resolve(null);
            return;
          }
          resolve({
            count: blobs.length,
            totalBytes: blobs.reduce((total, blob) => total + blob.size, 0),
          });
        };
        getAll.onerror = () => {
          db.close();
          resolve(null);
        };
      } catch {
        db.close();
        resolve(null);
      }
    };
  });
}
