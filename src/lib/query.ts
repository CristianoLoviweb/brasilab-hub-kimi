/**
 * Utilitários compartilhados de consulta (listagem, pesquisa e paginação).
 *
 * Toda listagem da plataforma deverá utilizar estes contratos, garantindo que
 * a substituição futura dos dados simulados por chamadas reais ao backend
 * ocorra sem alteração das páginas ou componentes.
 */

export interface ListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const DEFAULT_PAGE_SIZE = 10;

/** Normaliza texto para pesquisa (minúsculas e sem acentuação). */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Verifica se algum dos campos informados atende ao termo pesquisado. */
export function matchesSearch(term: string | undefined, ...fields: string[]): boolean {
  if (!term || !term.trim()) return true;
  const needle = normalize(term.trim());
  return fields.some((field) => normalize(field ?? "").includes(needle));
}

export function paginate<T>(
  rows: T[],
  page = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
): Paginated<T> {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: rows.slice(start, start + pageSize),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

/**
 * DEVELOPMENT ONLY (dados simulados)
 * Simula a latência de rede dos Services enquanto o backend não existe.
 */
export function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
