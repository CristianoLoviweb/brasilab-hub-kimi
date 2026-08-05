import type { ListParams, Paginated } from "@/lib/query";

import { LEAD_EFFECTIVE_CONTACT_RESULTS, isLeadClosed } from "../constants/leadDomain";
import {
  LEAD_APPROVAL_DEADLINE_HOURS,
  LEAD_FIRST_CONTACT_HOURS,
  firstContactDeadlineFrom,
} from "../constants/leadTiming";
import {
  addNoteFn,
  approveRequestFn,
  assignLeadDirectlyFn,
  convertLeadToProposalFn,
  createLeadFn,
  discardLeadFn,
  getLeadFn,
  getLeadsSummaryFn,
  listAgendaFn,
  listAllLeadsFn,
  listAvailableLeadsFn,
  listMyLeadsFn,
  listPendingRequestsFn,
  markLeadAsLostFn,
  registerContactFn,
  rejectRequestFn,
  removeFileFn,
  removeScheduleFn,
  requestLeadFn,
  scheduleContactFn,
  updateScheduleFn,
} from "@/server/fns/leadFns";
import type {
  CommercialActor,
  Lead,
  LeadContactChannel,
  LeadContactResult,
  LeadInput,
  LeadOrigin,
  LeadPriority,
  LeadSchedule,
  LeadScheduleStatus,
  LeadSituation,
} from "../types";

/**
 * Service oficial do módulo de Leads. Nenhuma página acessa os dados
 * diretamente (docs/07_PADROES_DE_DESENVOLVIMENTO.md — item Arquitetura).
 *
 * Sprint 03.2: as assinaturas públicas são exatamente as homologadas. As
 * chamadas agora chegam ao servidor por Server Functions, onde as regras
 * de negócio executam sobre o PostgreSQL com sessão e permissão reais.
 * O ator informado continua no contrato por compatibilidade — no servidor
 * ele é derivado da sessão autenticada.
 */

/* ------------------------------------------------------------------ leitura */

export interface LeadFilters extends ListParams {
  situation?: LeadSituation | "todas";
  origin?: LeadOrigin | "todas";
  priority?: LeadPriority | "todas";
  ownerId?: string;
  /** Ordenação da fila. */
  sort?: "recentes" | "antigos" | "prioridade";
}

export async function listAvailableLeads(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  return listAvailableLeadsFn({ data: filters });
}

/** Leads do vendedor autenticado (carteira). */
export async function listMyLeads(
  sellerId: string,
  filters: LeadFilters = {},
): Promise<Paginated<Lead>> {
  void sellerId; // o vendedor é derivado da sessão no servidor
  return listMyLeadsFn({ data: filters });
}

/** Visão completa — exige permissão `leads.visualizar_todos`. */
export async function listAllLeads(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  return listAllLeadsFn({ data: filters });
}

/** Solicitações aguardando decisão do gestor. */
export async function listPendingRequests(): Promise<Lead[]> {
  return listPendingRequestsFn();
}

export async function getLead(leadId: string): Promise<Lead | undefined> {
  return getLeadFn({ data: leadId });
}

export interface LeadAgendaItem {
  schedule: LeadSchedule;
  leadId: string;
  leadCode: string;
  requesterName: string;
  company: string;
}

export interface LeadAgendaFilters {
  ownerId?: string;
}

/** Agenda comercial consolidada (primeiro atendimento e reagendamentos). */
export async function listAgenda(filters: LeadAgendaFilters = {}): Promise<LeadAgendaItem[]> {
  return listAgendaFn({ data: filters });
}

export interface LeadsSummary {
  disponiveis: number;
  aguardandoAprovacao: number;
  meusLeads: number;
  primeiroContatoPendente: number;
  contatosHoje: number;
  contatosAtrasados: number;
  convertidos: number;
  devolvidos: number;
}

/** Indicadores utilizados nas listagens e nos Widgets do Dashboard. */
export async function getLeadsSummary(sellerId?: string): Promise<LeadsSummary> {
  return getLeadsSummaryFn({ data: { sellerId } });
}

/* ------------------------------------------------------------------ escrita */

export async function createLead(input: LeadInput, actor: CommercialActor): Promise<Lead> {
  void actor; // derivado da sessão no servidor
  return createLeadFn({ data: input });
}

/** Solicitação de atribuição pelo vendedor (Sprint 03 — item 7). */
export async function requestLead(leadId: string, actor: CommercialActor): Promise<Lead> {
  void actor;
  return requestLeadFn({ data: leadId });
}

/** Aprovação da solicitação pelo gestor (item 9). */
export async function approveRequest(leadId: string, actor: CommercialActor): Promise<Lead> {
  void actor;
  return approveRequestFn({ data: leadId });
}

/** Recusa da solicitação — justificativa obrigatória (item 10). */
export async function rejectRequest(
  leadId: string,
  actor: CommercialActor,
  justification: string,
): Promise<Lead> {
  void actor;
  return rejectRequestFn({ data: { leadId, justification } });
}

export interface DirectAssignmentInput {
  sellerId: string;
  sellerName: string;
  firstContactHours: number;
  priority: LeadPriority;
  observation?: string | undefined;
}

/** Atribuição direta pelo gestor — sem aguardar as 12 horas (item 11). */
export async function assignLeadDirectly(
  leadId: string,
  actor: CommercialActor,
  input: DirectAssignmentInput,
): Promise<Lead> {
  void actor;
  return assignLeadDirectlyFn({ data: { leadId, input } });
}

export interface RegisterContactInput {
  channel: LeadContactChannel;
  result: LeadContactResult;
  notes: string;
  nextStep?: string | undefined;
  nextScheduleAt?: string;
  nextScheduleDescription?: string;
}

/** Registro de contato realizado (item 19) e reagendamento opcional (item 14). */
export async function registerContact(
  leadId: string,
  actor: CommercialActor,
  input: RegisterContactInput,
): Promise<Lead> {
  void actor;
  return registerContactFn({ data: { leadId, input } });
}

/** Agendamento avulso de contato. */
export async function scheduleContact(
  leadId: string,
  actor: CommercialActor,
  input: { scheduledFor: string; description: string },
): Promise<Lead> {
  void actor;
  return scheduleContactFn({ data: { leadId, input } });
}

export interface UpdateScheduleInput {
  title: string;
  description: string;
  scheduledFor: string;
  ownerId: string;
  ownerName: string;
  status: LeadScheduleStatus;
}

/** Edição de compromisso — atualiza o registro existente, sem duplicidade. */
export async function updateSchedule(
  leadId: string,
  actor: CommercialActor,
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<Lead> {
  void actor;
  return updateScheduleFn({ data: { leadId, scheduleId, input } });
}

/** Exclusão de compromisso — sempre registrada (nunca silenciosa). */
export async function removeSchedule(
  leadId: string,
  actor: CommercialActor,
  scheduleId: string,
): Promise<Lead> {
  void actor;
  return removeScheduleFn({ data: { leadId, scheduleId } });
}

export async function addNote(
  leadId: string,
  actor: CommercialActor,
  content: string,
): Promise<Lead> {
  void actor;
  return addNoteFn({ data: { leadId, content } });
}

/**
 * Inclusão de arquivo com conteúdo real. O upload é feito pela rota
 * dedicada /api/leads/arquivos (multipart — nunca Base64); veja
 * leadFileStorage.uploadLeadFile.
 */

/** Remoção de arquivo — metadados no banco e binário no storage do servidor. */
export async function removeFile(
  leadId: string,
  actor: CommercialActor,
  fileId: string,
): Promise<Lead> {
  void actor;
  return removeFileFn({ data: { leadId, fileId } });
}

export async function markLeadAsLost(
  leadId: string,
  actor: CommercialActor,
  reason: string,
): Promise<Lead> {
  void actor;
  return markLeadAsLostFn({ data: { leadId, reason } });
}

export async function discardLead(
  leadId: string,
  actor: CommercialActor,
  reason: string,
): Promise<Lead> {
  void actor;
  return discardLeadFn({ data: { leadId, reason } });
}

/** Verifica se o Lead atende às condições de conversão (item 23). */
export function canConvertLead(lead: Lead, actor: CommercialActor): boolean {
  if (isLeadClosed(lead.situation)) return false;
  if (lead.situation !== "atribuido") return false;
  if (lead.ownerId !== actor.id && !actor.isManager) return false;
  return lead.contacts.some((contact) => LEAD_EFFECTIVE_CONTACT_RESULTS.includes(contact.result));
}

export interface LeadConversionResult {
  lead: Lead;
  /** Vínculo simulado com a futura Proposta (Sprint 04). */
  proposalRef: string;
}

/**
 * Conversão simulada em Proposta.
 * A numeração definitiva e o formulário completo pertencem à Sprint 04.
 */
export async function convertLeadToProposal(
  leadId: string,
  actor: CommercialActor,
): Promise<LeadConversionResult> {
  void actor;
  return convertLeadToProposalFn({ data: leadId });
}

/** Prazo padrão exposto para a interface — nunca redefinido nos componentes. */
export const LEAD_SERVICE_DEFAULTS = {
  approvalDeadlineHours: LEAD_APPROVAL_DEADLINE_HOURS,
  firstContactHours: LEAD_FIRST_CONTACT_HOURS,
  firstContactDeadlineFrom,
} as const;
