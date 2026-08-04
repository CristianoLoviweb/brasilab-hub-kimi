/**
 * Parâmetros temporais do módulo de Leads.
 *
 * Regra oficial da Sprint 03: nenhum prazo poderá ser espalhado pelos
 * componentes. Toda a interface e todos os Services consomem exclusivamente
 * este arquivo. Futuramente estes valores serão configuráveis pelo
 * Administrador e validados no backend.
 */

/** Prazo do gestor para aprovar ou recusar uma solicitação (horas corridas). */
export const LEAD_APPROVAL_DEADLINE_HOURS = 12;

/**
 * Prazo simulado do primeiro contato após a atribuição (horas corridas).
 * Valor provisório de demonstração — a duração definitiva será parametrizada.
 */
export const LEAD_FIRST_CONTACT_HOURS = 24;

/** Janela considerada "próxima do vencimento" nos alertas da agenda (horas). */
export const LEAD_DEADLINE_WARNING_HOURS = 3;

const HOUR_IN_MS = 60 * 60 * 1000;

export function addHours(isoDate: string, hours: number): string {
  return new Date(new Date(isoDate).getTime() + hours * HOUR_IN_MS).toISOString();
}

/** Prazo de decisão do gestor a partir do momento da solicitação. */
export function approvalDeadlineFrom(requestedAt: string): string {
  return addHours(requestedAt, LEAD_APPROVAL_DEADLINE_HOURS);
}

/** Prazo do primeiro contato a partir do momento da atribuição. */
export function firstContactDeadlineFrom(assignedAt: string): string {
  return addHours(assignedAt, LEAD_FIRST_CONTACT_HOURS);
}
