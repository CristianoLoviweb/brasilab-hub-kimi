import { randomUUID } from "node:crypto";

import { formatDateTime, matchesSearch, paginate } from "@/lib/query";
import type { ListParams, Paginated } from "@/lib/query";
import type { AuditAction } from "@/features/audit/types";

import {
  LEAD_EFFECTIVE_CONTACT_RESULTS,
  LEAD_SCHEDULE_STATUS_LABELS,
  isLeadClosed,
} from "@/features/leads/constants/leadDomain";
import { LEAD_EVENTS } from "@/features/leads/constants/leadEvents";
import {
  LEAD_APPROVAL_DEADLINE_HOURS,
  LEAD_FIRST_CONTACT_HOURS,
  addHours,
  approvalDeadlineFrom,
  firstContactDeadlineFrom,
} from "@/features/leads/constants/leadTiming";
import type {
  CommercialActor,
  Lead,
  LeadContact,
  LeadContactChannel,
  LeadContactResult,
  LeadFile,
  LeadHistoryEntry,
  LeadInput,
  LeadNote,
  LeadOrigin,
  LeadPriority,
  LeadSchedule,
  LeadScheduleStatus,
  LeadSituation,
} from "@/features/leads/types";

import { storagePathOf, withLeadStore, type LeadSequences } from "../repositories/leadRepository";
import { deleteFileContent, saveFileContent } from "../storage/fileStorage";
import { registerAuditEvent } from "./auditService.server";

/**
 * Service oficial do módulo de Leads NO SERVIDOR (Sprint 03.2).
 *
 * A lógica é exatamente a homologada nas Sprints 03–03.1 (Revisões 01 e 02):
 * mesmas regras temporais, mesmos eventos de Histórico e Auditoria, mesmos
 * formatos de identificadores. O que mudou é apenas a FONTE DOS DADOS: o
 * estado passa a ser carregado e persistido no PostgreSQL a cada operação
 * (withLeadStore — acesso serializado e gravação somente do que mudou).
 *
 * Nenhuma página acessa este módulo: as páginas continuam chamando o
 * service do cliente (src/features/leads/services/leadService.ts), que tem
 * as mesmas assinaturas e repassa as chamadas pelas Server Functions.
 */

/**
 * Service oficial do módulo de Leads. Nenhuma página acessa os dados
 * diretamente (docs/07_PADROES_DE_DESENVOLVIMENTO.md — item Arquitetura).
 *
 * Sprint 03.1: a base inicia vazia — nenhum Lead fictício. As regras
 * temporais (aprovação em 12 horas e primeiro contato) são aplicadas de
 * forma determinística a cada leitura, a partir das datas registradas.
 * Nenhuma tarefa em segundo plano é executada nesta etapa: quando o backend
 * existir, exatamente estas regras passarão a ser executadas no servidor,
 * mantendo as assinaturas públicas abaixo.
 */

let store: Lead[] = [];

let leadSequence = 0;
let historySequence = 10_000;
let scheduleSequence = 10_000;
let contactSequence = 10_000;
let noteSequence = 10_000;
let requestSequence = 10_000;
let proposalSequence = 100;

/** Sequências derivadas do estado persistido — nunca reiniciam nem colidem. */
function assignSequences(sequences: LeadSequences): void {
  leadSequence = sequences.lead;
  historySequence = Math.max(10_000, sequences.history);
  scheduleSequence = Math.max(10_000, sequences.schedule);
  contactSequence = Math.max(10_000, sequences.contact);
  noteSequence = Math.max(10_000, sequences.note);
  requestSequence = Math.max(10_000, sequences.request);
}

function maxProposalSuffix(leads: Lead[]): number {
  let max = 100;
  for (const lead of leads) {
    const match = /^PRP-SIM-(\d+)$/.exec(lead.proposalRef ?? "");
    if (match) max = Math.max(max, Number.parseInt(match[1] ?? "0", 10));
  }
  return max;
}

let storeActive = false;

/**
 * Executa a operação sobre o estado carregado do PostgreSQL, com acesso
 * exclusivo; ao final, apenas os agregados alterados são persistidos.
 * Chamadas aninhadas (um service que consulta outro) reutilizam o estado
 * já carregado.
 */
async function run<T>(operation: () => Promise<T>): Promise<T> {
  if (storeActive) return operation();
  return withLeadStore(async ({ store: loaded, sequences }) => {
    store = loaded;
    assignSequences(sequences);
    proposalSequence = maxProposalSuffix(loaded);
    storeActive = true;
    try {
      return await operation();
    } finally {
      storeActive = false;
    }
  });
}

function nextCode(): { id: string; code: string } {
  leadSequence += 1;
  return {
    id: `LEAD-${String(leadSequence).padStart(4, "0")}`,
    // Padrão ilustrativo documentado (docs/regras_de_negocio/01_NUMERACAO.md).
    code: `LD26${String(leadSequence).padStart(5, "0")}`,
  };
}

function entry(
  event: string,
  description: string,
  actor: Pick<CommercialActor, "id" | "name"> | null,
  origin: LeadHistoryEntry["origin"] = "interface",
): LeadHistoryEntry {
  historySequence += 1;
  return {
    id: `LHT-${String(historySequence).padStart(4, "0")}`,
    event,
    description,
    occurredAt: new Date().toISOString(),
    actorId: actor?.id ?? "SYS",
    actorName: actor?.name ?? "Sistema Brasilab",
    origin,
  };
}

/** Histórico é sempre acrescido — nunca alterado ou removido. */
function appendHistory(lead: Lead, item: LeadHistoryEntry): void {
  lead.history = [...lead.history, item];
}

async function audit(
  action: AuditAction,
  lead: Lead,
  description: string,
  actor?: CommercialActor,
) {
  await registerAuditEvent({
    entity: "lead",
    action,
    entityId: lead.id,
    description,
    ...(actor ? { actorId: actor.id, actorName: actor.name, actorGroup: actor.groupCode } : {}),
  });
}

function createFirstContactSchedule(
  lead: Lead,
  assignedAt: string,
  hours: number = LEAD_FIRST_CONTACT_HOURS,
): LeadSchedule {
  scheduleSequence += 1;
  return {
    id: `LSC-${String(scheduleSequence).padStart(4, "0")}`,
    leadId: lead.id,
    title: `Primeiro contato com o Lead ${lead.code}`,
    description: "Contato inicial obrigatório após a atribuição.",
    scheduledFor: addHours(assignedAt, hours),
    status: "pendente",
    isFirstContact: true,
    ownerId: lead.ownerId ?? "",
    ownerName: lead.ownerName ?? "",
    createdAt: assignedAt,
  };
}

function assignLead(
  lead: Lead,
  seller: { id: string; name: string },
  manager: { id: string; name: string } | null,
  firstContactHours: number = LEAD_FIRST_CONTACT_HOURS,
): void {
  const assignedAt = new Date().toISOString();

  lead.ownerId = seller.id;
  lead.ownerName = seller.name;
  lead.assignedAt = assignedAt;
  lead.managerId = manager?.id ?? lead.managerId;
  lead.managerName = manager?.name ?? lead.managerName;
  lead.situation = "atribuido";
  lead.schedules = [
    ...lead.schedules,
    createFirstContactSchedule(lead, assignedAt, firstContactHours),
  ];

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.firstContactScheduled,
      "Primeiro contato agendado automaticamente pelo sistema.",
      null,
      "sistema",
    ),
  );
}

/**
 * Regras temporais simuladas.
 *
 * 1. Solicitação não decidida em 12 horas → aprovação automática.
 * 2. Primeiro contato automático vencido sem contato válido → Lead devolvido
 *    à fila de disponíveis (docs — Sprint 03, itens 8 e 13).
 */
async function applyTemporalRules(reference = Date.now()): Promise<void> {
  for (const lead of store) {
    const request = lead.request;

    if (
      request &&
      request.status === "pendente" &&
      new Date(request.deadlineAt).getTime() <= reference
    ) {
      request.status = "aprovada_automaticamente";
      request.decidedAt = request.deadlineAt;

      appendHistory(
        lead,
        entry(
          LEAD_EVENTS.assignmentAutoApproved,
          `Solicitação aprovada automaticamente após ${LEAD_APPROVAL_DEADLINE_HOURS} horas sem decisão do gestor.`,
          null,
          "sistema",
        ),
      );

      assignLead(lead, { id: request.sellerId, name: request.sellerName }, null);
      lead.request = null;

      appendHistory(
        lead,
        entry(
          LEAD_EVENTS.assigned,
          `Lead atribuído a ${request.sellerName} por expiração do prazo de aprovação.`,
          null,
          "sistema",
        ),
      );

      await audit(
        "atribuido",
        lead,
        `Lead ${lead.code} atribuído automaticamente a ${request.sellerName} por expiração do prazo.`,
      );
      continue;
    }

    if (lead.situation !== "atribuido") continue;

    const firstContact = lead.schedules.find((item) => item.isFirstContact);
    if (!firstContact || firstContact.status !== "pendente") continue;
    if (new Date(firstContact.scheduledFor).getTime() > reference) continue;

    firstContact.status = "expirado";
    const previousOwner = lead.ownerName ?? "vendedor anterior";

    lead.ownerId = null;
    lead.ownerName = null;
    lead.assignedAt = null;
    lead.situation = "disponivel";
    lead.closingReason = "Falta do primeiro atendimento";

    appendHistory(
      lead,
      entry(
        LEAD_EVENTS.firstContactExpired,
        `Primeiro contato não realizado por ${previousOwner} dentro do prazo.`,
        null,
        "sistema",
      ),
    );
    appendHistory(
      lead,
      entry(
        LEAD_EVENTS.released,
        "Lead devolvido à fila de disponíveis por falta do primeiro atendimento.",
        null,
        "sistema",
      ),
    );

    await audit(
      "liberado",
      lead,
      `Lead ${lead.code} devolvido à fila por falta do primeiro atendimento de ${previousOwner}.`,
    );
  }
}

function clone(lead: Lead): Lead {
  return JSON.parse(JSON.stringify(lead)) as Lead;
}

function find(leadId: string): Lead {
  const lead = store.find((item) => item.id === leadId);
  if (!lead) throw new Error("Lead não encontrado.");
  return lead;
}

/* ------------------------------------------------------------------ leitura */

export interface LeadFilters extends ListParams {
  situation?: LeadSituation | "todas";
  origin?: LeadOrigin | "todas";
  priority?: LeadPriority | "todas";
  ownerId?: string;
  /** Ordenação da fila. */
  sort?: "recentes" | "antigos" | "prioridade";
}

const PRIORITY_WEIGHT: Record<LeadPriority, number> = {
  urgente: 4,
  alta: 3,
  normal: 2,
  baixa: 1,
};

function applyFilters(rows: Lead[], filters: LeadFilters): Lead[] {
  return rows
    .filter((lead) =>
      filters.situation && filters.situation !== "todas"
        ? lead.situation === filters.situation
        : true,
    )
    .filter((lead) =>
      filters.origin && filters.origin !== "todas" ? lead.origin === filters.origin : true,
    )
    .filter((lead) =>
      filters.priority && filters.priority !== "todas" ? lead.priority === filters.priority : true,
    )
    .filter((lead) => (filters.ownerId ? lead.ownerId === filters.ownerId : true))
    .filter((lead) =>
      matchesSearch(
        filters.search,
        lead.code,
        lead.requester.name,
        lead.requester.company,
        lead.requester.city,
        lead.interest.product,
      ),
    )
    .sort((a, b) => {
      if (filters.sort === "antigos") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filters.sort === "prioridade") {
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Fila pública: somente Leads sem vendedor, sem solicitação pendente e não
 * encerrados (Sprint 03 — itens 5 e 6).
 */
async function listAvailableLeadsImpl(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  await applyTemporalRules();

  const rows = applyFilters(
    store.filter((lead) => lead.situation === "disponivel" && !lead.ownerId && !lead.request),
    filters,
  ).map(clone);

  return paginate(rows, filters.page, filters.pageSize);
}

/** Leads do vendedor autenticado (carteira). */
async function listMyLeadsImpl(
  sellerId: string,
  filters: LeadFilters = {},
): Promise<Paginated<Lead>> {
  await applyTemporalRules();

  const { ownerId: _ignored, ...rest } = filters;
  const rows = applyFilters(
    store.filter((lead) => lead.ownerId === sellerId || lead.request?.sellerId === sellerId),
    rest,
  ).map(clone);

  return paginate(rows, filters.page, filters.pageSize);
}

/** Visão completa — exige permissão `leads.visualizar_todos`. */
async function listAllLeadsImpl(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  await applyTemporalRules();

  const rows = applyFilters(store, filters).map(clone);
  return paginate(rows, filters.page, filters.pageSize);
}

/** Solicitações aguardando decisão do gestor. */
async function listPendingRequestsImpl(): Promise<Lead[]> {
  await applyTemporalRules();

  return store
    .filter((lead) => lead.request?.status === "pendente")
    .sort(
      (a, b) =>
        new Date(a.request!.deadlineAt).getTime() - new Date(b.request!.deadlineAt).getTime(),
    )
    .map(clone);
}

async function getLeadImpl(leadId: string): Promise<Lead | undefined> {
  await applyTemporalRules();

  const lead = store.find((item) => item.id === leadId);
  return lead ? clone(lead) : undefined;
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
async function listAgendaImpl(filters: LeadAgendaFilters = {}): Promise<LeadAgendaItem[]> {
  await applyTemporalRules();

  return store
    .flatMap((lead) =>
      lead.schedules
        .filter((item) => (filters.ownerId ? item.ownerId === filters.ownerId : true))
        .map((schedule) => ({
          schedule: { ...schedule },
          leadId: lead.id,
          leadCode: lead.code,
          requesterName: lead.requester.name,
          company: lead.requester.company,
        })),
    )
    .sort(
      (a, b) =>
        new Date(a.schedule.scheduledFor).getTime() - new Date(b.schedule.scheduledFor).getTime(),
    );
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
async function getLeadsSummaryImpl(sellerId?: string): Promise<LeadsSummary> {
  await applyTemporalRules();

  const now = Date.now();
  const today = new Date();

  const schedules = store.flatMap((lead) =>
    lead.schedules.filter((item) => (sellerId ? item.ownerId === sellerId : true)),
  );

  return {
    disponiveis: store.filter((lead) => lead.situation === "disponivel" && !lead.request).length,
    aguardandoAprovacao: store.filter((lead) => lead.request?.status === "pendente").length,
    meusLeads: sellerId
      ? store.filter((lead) => lead.ownerId === sellerId).length
      : store.filter((lead) => lead.situation === "atribuido").length,
    primeiroContatoPendente: schedules.filter(
      (item) => item.isFirstContact && item.status === "pendente",
    ).length,
    contatosHoje: schedules.filter((item) => {
      const date = new Date(item.scheduledFor);
      return (
        item.status === "pendente" &&
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length,
    contatosAtrasados: schedules.filter(
      (item) => item.status === "pendente" && new Date(item.scheduledFor).getTime() < now,
    ).length,
    convertidos: store.filter((lead) => lead.situation === "convertido").length,
    devolvidos: store.filter((lead) => lead.closingReason === "Falta do primeiro atendimento")
      .length,
  };
}

/* ------------------------------------------------------------------ escrita */

async function createLeadImpl(input: LeadInput, actor: CommercialActor): Promise<Lead> {
  const { id, code } = nextCode();
  const createdAt = new Date().toISOString();

  const lead: Lead = {
    id,
    code,
    status: "novo",
    situation: "disponivel",
    origin: input.origin,
    priority: input.priority,
    requester: input.requester,
    interest: input.interest,
    createdAt,
    ownerId: null,
    ownerName: null,
    assignedAt: null,
    managerId: null,
    managerName: null,
    request: null,
    schedules: [],
    contacts: [],
    notes: [],
    files: [],
    history: [],
    proposalRef: null,
    closingReason: null,
  };

  appendHistory(lead, entry(LEAD_EVENTS.created, `Lead ${code} cadastrado manualmente.`, actor));

  if (input.assignToSellerId) {
    const seller = { id: input.assignToSellerId, name: input.assignToSellerId };
    const resolved = store.find((item) => item.ownerId === input.assignToSellerId);
    assignLead(
      lead,
      { id: seller.id, name: resolved?.ownerName ?? seller.name },
      { id: actor.id, name: actor.name },
    );
    appendHistory(
      lead,
      entry(
        LEAD_EVENTS.assigned,
        `Lead atribuído diretamente no cadastro por ${actor.name}.`,
        actor,
      ),
    );
  }

  store.push(lead);
  audit("criado", lead, `Lead ${code} cadastrado manualmente por ${actor.name}.`, actor);

  return clone(lead);
}

/** Solicitação de atribuição pelo vendedor (Sprint 03 — item 7). */
async function requestLeadImpl(leadId: string, actor: CommercialActor): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  if (lead.situation !== "disponivel" || lead.request) {
    throw new Error("Este Lead não está disponível para solicitação.");
  }

  const requestedAt = new Date().toISOString();
  requestSequence += 1;

  lead.request = {
    id: `LRQ-${String(requestSequence).padStart(4, "0")}`,
    leadId: lead.id,
    sellerId: actor.id,
    sellerName: actor.name,
    requestedAt,
    deadlineAt: approvalDeadlineFrom(requestedAt),
    status: "pendente",
    decidedAt: null,
    managerId: null,
    managerName: null,
    justification: null,
  };
  lead.situation = "aguardando_aprovacao";
  lead.closingReason = null;

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.requested,
      `Lead solicitado por ${actor.name}. Prazo de ${LEAD_APPROVAL_DEADLINE_HOURS} horas para decisão do gestor.`,
      actor,
    ),
  );

  audit("solicitado", lead, `Lead ${lead.code} solicitado por ${actor.name}.`, actor);

  return clone(lead);
}

/** Aprovação da solicitação pelo gestor (item 9). */
async function approveRequestImpl(leadId: string, actor: CommercialActor): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  const request = lead.request;
  if (!request || request.status !== "pendente") {
    throw new Error("Não existe solicitação pendente para este Lead.");
  }

  request.status = "aprovada";
  request.decidedAt = new Date().toISOString();
  request.managerId = actor.id;
  request.managerName = actor.name;

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.assignmentApproved,
      `Solicitação de ${request.sellerName} aprovada por ${actor.name}.`,
      actor,
    ),
  );

  assignLead(
    lead,
    { id: request.sellerId, name: request.sellerName },
    { id: actor.id, name: actor.name },
  );
  lead.request = null;

  appendHistory(
    lead,
    entry(LEAD_EVENTS.assigned, `Lead atribuído a ${request.sellerName}.`, actor),
  );

  audit("aprovado", lead, `Solicitação do Lead ${lead.code} aprovada por ${actor.name}.`, actor);

  return clone(lead);
}

/** Recusa da solicitação — justificativa obrigatória (item 10). */
async function rejectRequestImpl(
  leadId: string,
  actor: CommercialActor,
  justification: string,
): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  const request = lead.request;
  if (!request || request.status !== "pendente") {
    throw new Error("Não existe solicitação pendente para este Lead.");
  }
  if (!justification.trim()) {
    throw new Error("A justificativa é obrigatória.");
  }

  request.status = "recusada";
  request.decidedAt = new Date().toISOString();
  request.managerId = actor.id;
  request.managerName = actor.name;
  request.justification = justification.trim();

  lead.request = null;
  lead.situation = "disponivel";
  lead.managerId = actor.id;
  lead.managerName = actor.name;

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.assignmentRejected,
      `Solicitação de ${request.sellerName} recusada por ${actor.name}: ${request.justification}`,
      actor,
    ),
  );
  appendHistory(lead, entry(LEAD_EVENTS.released, "Lead devolvido à fila de disponíveis.", actor));

  audit("recusado", lead, `Solicitação do Lead ${lead.code} recusada por ${actor.name}.`, actor);

  return clone(lead);
}

export interface DirectAssignmentInput {
  sellerId: string;
  sellerName: string;
  firstContactHours: number;
  priority: LeadPriority;
  observation?: string | undefined;
}

/** Atribuição direta pelo gestor — sem aguardar as 12 horas (item 11). */
async function assignLeadDirectlyImpl(
  leadId: string,
  actor: CommercialActor,
  input: DirectAssignmentInput,
): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  if (isLeadClosed(lead.situation)) {
    throw new Error("Lead encerrado não pode ser atribuído.");
  }

  if (lead.request?.status === "pendente") {
    lead.request.status = "recusada";
    lead.request.decidedAt = new Date().toISOString();
    lead.request.managerId = actor.id;
    lead.request.managerName = actor.name;
    lead.request.justification = "Atribuição direta realizada pelo gestor.";
    appendHistory(
      lead,
      entry(
        LEAD_EVENTS.assignmentRejected,
        `Solicitação de ${lead.request.sellerName} encerrada em razão de atribuição direta.`,
        actor,
      ),
    );
    lead.request = null;
  }

  lead.priority = input.priority;
  assignLead(
    lead,
    { id: input.sellerId, name: input.sellerName },
    { id: actor.id, name: actor.name },
    input.firstContactHours,
  );

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.assigned,
      `Lead atribuído diretamente a ${input.sellerName} por ${actor.name}.${
        input.observation ? ` Observação: ${input.observation}` : ""
      }`,
      actor,
    ),
  );

  audit("atribuido", lead, `Lead ${lead.code} atribuído diretamente a ${input.sellerName}.`, actor);

  return clone(lead);
}

export interface RegisterContactInput {
  channel: LeadContactChannel;
  result: LeadContactResult;
  notes: string;
  nextStep?: string | undefined;
  nextScheduleAt?: string | undefined;
  nextScheduleDescription?: string | undefined;
}

/** Registro de contato realizado (item 19) e reagendamento opcional (item 14). */
async function registerContactImpl(
  leadId: string,
  actor: CommercialActor,
  input: RegisterContactInput,
): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  if (isLeadClosed(lead.situation)) {
    throw new Error("Lead encerrado não permite novos contatos.");
  }
  if (lead.ownerId !== actor.id && !actor.isManager) {
    throw new Error("Somente o vendedor responsável pode registrar contatos.");
  }

  contactSequence += 1;
  const contact: LeadContact = {
    id: `LCT-${String(contactSequence).padStart(4, "0")}`,
    channel: input.channel,
    result: input.result,
    occurredAt: new Date().toISOString(),
    notes: input.notes.trim(),
    nextStep: input.nextStep?.trim() ?? "",
    authorId: actor.id,
    authorName: actor.name,
  };

  lead.contacts = [...lead.contacts, contact];

  // Contato válido conclui o primeiro atendimento e evita a devolução à fila.
  if (LEAD_EFFECTIVE_CONTACT_RESULTS.includes(input.result)) {
    const firstContact = lead.schedules.find(
      (item) => item.isFirstContact && item.status === "pendente",
    );
    if (firstContact) firstContact.status = "concluido";
    if (lead.status === "novo") {
      lead.status = "em_contato";
      appendHistory(
        lead,
        entry(LEAD_EVENTS.statusChanged, "Status alterado para Em Contato.", actor),
      );
    }
    if (input.result === "oportunidade_qualificada") {
      lead.status = "qualificado";
      appendHistory(
        lead,
        entry(LEAD_EVENTS.statusChanged, "Status alterado para Qualificado.", actor),
      );
    }
  }

  appendHistory(
    lead,
    entry(LEAD_EVENTS.contactCreated, `Contato registrado por ${actor.name}.`, actor),
  );
  audit("contato_registrado", lead, `Contato registrado no Lead ${lead.code}.`, actor);

  if (input.nextScheduleAt) {
    scheduleSequence += 1;
    lead.schedules = [
      ...lead.schedules,
      {
        id: `LSC-${String(scheduleSequence).padStart(4, "0")}`,
        leadId: lead.id,
        title: `Retorno ao Lead ${lead.code}`,
        description: input.nextScheduleDescription?.trim() || "Novo contato agendado.",
        scheduledFor: new Date(input.nextScheduleAt).toISOString(),
        status: "pendente",
        isFirstContact: false,
        ownerId: lead.ownerId ?? actor.id,
        ownerName: lead.ownerName ?? actor.name,
        createdAt: new Date().toISOString(),
      },
    ];

    appendHistory(lead, entry(LEAD_EVENTS.contactRescheduled, "Novo contato agendado.", actor));
    audit("agendado", lead, `Novo contato agendado no Lead ${lead.code}.`, actor);
  }

  return clone(lead);
}

/** Agendamento avulso de contato. */
async function scheduleContactImpl(
  leadId: string,
  actor: CommercialActor,
  input: { scheduledFor: string; description: string },
): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  if (isLeadClosed(lead.situation)) {
    throw new Error("Lead encerrado não permite agendamentos.");
  }

  scheduleSequence += 1;
  lead.schedules = [
    ...lead.schedules,
    {
      id: `LSC-${String(scheduleSequence).padStart(4, "0")}`,
      leadId: lead.id,
      title: `Contato agendado — Lead ${lead.code}`,
      description: input.description.trim(),
      scheduledFor: new Date(input.scheduledFor).toISOString(),
      status: "pendente",
      isFirstContact: false,
      ownerId: lead.ownerId ?? actor.id,
      ownerName: lead.ownerName ?? actor.name,
      createdAt: new Date().toISOString(),
    },
  ];

  appendHistory(lead, entry(LEAD_EVENTS.contactRescheduled, "Contato agendado.", actor));
  audit("agendado", lead, `Contato agendado no Lead ${lead.code}.`, actor);

  return clone(lead);
}

export interface UpdateScheduleInput {
  title: string;
  description: string;
  scheduledFor: string;
  ownerId: string;
  ownerName: string;
  status: LeadScheduleStatus;
}

/** Descreve campo a campo o que mudou (dados anteriores e novos). */
function describeScheduleChanges(before: LeadSchedule, after: UpdateScheduleInput): string {
  const changes: string[] = [];
  const nextIso = new Date(after.scheduledFor).toISOString();

  if (before.title !== after.title.trim()) {
    changes.push(`Título: "${before.title}" → "${after.title.trim()}"`);
  }
  if (before.description !== after.description.trim()) {
    changes.push(`Descrição: "${before.description}" → "${after.description.trim()}"`);
  }
  if (before.scheduledFor !== nextIso) {
    changes.push(
      `Data/horário: ${formatDateTime(before.scheduledFor)} → ${formatDateTime(nextIso)}`,
    );
  }
  if (before.ownerId !== after.ownerId) {
    changes.push(`Responsável: ${before.ownerName} → ${after.ownerName}`);
  }
  if (before.status !== after.status) {
    changes.push(
      `Status: ${LEAD_SCHEDULE_STATUS_LABELS[before.status]} → ${LEAD_SCHEDULE_STATUS_LABELS[after.status]}`,
    );
  }
  return changes.join("; ");
}

/**
 * Edição de compromisso da agenda — atualiza o registro existente
 * (nunca cria duplicidade) e registra a alteração no Histórico e na
 * Auditoria com os dados anteriores e os novos dados.
 */
async function updateScheduleImpl(
  leadId: string,
  actor: CommercialActor,
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  const schedule = lead.schedules.find((item) => item.id === scheduleId);
  if (!schedule) throw new Error("Compromisso não encontrado.");

  const changes = describeScheduleChanges({ ...schedule }, input);

  schedule.title = input.title.trim();
  schedule.description = input.description.trim();
  schedule.scheduledFor = new Date(input.scheduledFor).toISOString();
  schedule.ownerId = input.ownerId;
  schedule.ownerName = input.ownerName;
  schedule.status = input.status;

  const summary = changes || "sem alteração de dados";
  appendHistory(
    lead,
    entry(LEAD_EVENTS.scheduleUpdated, `Compromisso alterado: ${summary}.`, actor),
  );
  await audit(
    "agendamento_editado",
    lead,
    `Compromisso editado no Lead ${lead.code}: ${summary}.`,
    actor,
  );

  return clone(lead);
}

/**
 * Exclusão de compromisso da agenda — remove o registro e registra a
 * exclusão no Histórico e na Auditoria (nunca silenciosa).
 */
async function removeScheduleImpl(
  leadId: string,
  actor: CommercialActor,
  scheduleId: string,
): Promise<Lead> {
  await applyTemporalRules();

  const lead = find(leadId);
  const schedule = lead.schedules.find((item) => item.id === scheduleId);
  if (!schedule) throw new Error("Compromisso não encontrado.");

  lead.schedules = lead.schedules.filter((item) => item.id !== scheduleId);

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.scheduleRemoved,
      `Compromisso excluído: ${schedule.title} (${formatDateTime(schedule.scheduledFor)}).`,
      actor,
    ),
  );
  audit("agendamento_excluido", lead, `Compromisso excluído do Lead ${lead.code}.`, actor);

  return clone(lead);
}

async function addNoteImpl(leadId: string, actor: CommercialActor, content: string): Promise<Lead> {
  const lead = find(leadId);

  noteSequence += 1;
  const note: LeadNote = {
    id: `LNT-${String(noteSequence).padStart(4, "0")}`,
    content: content.trim(),
    authorId: actor.id,
    authorName: actor.name,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    visibility: "interna",
  };

  lead.notes = [...lead.notes, note];
  appendHistory(
    lead,
    entry(LEAD_EVENTS.noteCreated, `Nota interna adicionada por ${actor.name}.`, actor),
  );
  audit("nota_adicionada", lead, `Nota interna adicionada ao Lead ${lead.code}.`, actor);

  return clone(lead);
}

/**
 * Inclusão de arquivo com conteúdo real.
 * O binário é persistido no armazenamento local estruturado (IndexedDB,
 * ver src/server/storage) e o banco mantém metadados + caminho relativo — o mesmo
 * contrato que o backend definitivo receberá
 * (docs/regras_de_negocio/06_ARQUIVOS.md e diretrizes de segurança).
 */
async function addFileImpl(
  leadId: string,
  actor: CommercialActor,
  input: { name: string; classification: string; content: Blob },
): Promise<Lead> {
  const lead = find(leadId);
  const extension = input.name.includes(".")
    ? (input.name.split(".").pop() ?? "").toLowerCase()
    : "";

  const file: LeadFile = {
    id: randomUUID(),
    name: input.name.trim(),
    classification: input.classification,
    extension,
    sizeInBytes: input.content.size,
    uploadedAt: new Date().toISOString(),
    authorId: actor.id,
    authorName: actor.name,
  };

  await saveFileContent(storagePathOf(file, lead.code), input.content);

  lead.files = [...lead.files, file];
  appendHistory(lead, entry(LEAD_EVENTS.fileAdded, `Arquivo ${file.name} adicionado.`, actor));
  audit("arquivo_adicionado", lead, `Arquivo adicionado ao Lead ${lead.code}.`, actor);

  return clone(lead);
}

/**
 * Remoção de arquivo — exclui os metadados do Lead e o conteúdo binário
 * do armazenamento local, registrando o evento no Histórico e na Auditoria.
 */
async function removeFileImpl(
  leadId: string,
  actor: CommercialActor,
  fileId: string,
): Promise<Lead> {
  const lead = find(leadId);
  const file = lead.files.find((item) => item.id === fileId);
  if (!file) throw new Error("Arquivo não encontrado.");

  lead.files = lead.files.filter((item) => item.id !== fileId);
  await deleteFileContent(storagePathOf(file, lead.code));

  appendHistory(lead, entry(LEAD_EVENTS.fileRemoved, `Arquivo ${file.name} removido.`, actor));
  audit("arquivo_removido", lead, `Arquivo removido do Lead ${lead.code}.`, actor);

  return clone(lead);
}

async function markLeadAsLostImpl(
  leadId: string,
  actor: CommercialActor,
  reason: string,
): Promise<Lead> {
  const lead = find(leadId);
  if (isLeadClosed(lead.situation)) throw new Error("Lead já encerrado.");

  lead.status = "perdido";
  lead.situation = "perdido";
  lead.closingReason = reason.trim();

  appendHistory(
    lead,
    entry(LEAD_EVENTS.lost, `Lead marcado como perdido: ${lead.closingReason}`, actor),
  );
  audit("perdido", lead, `Lead ${lead.code} marcado como perdido.`, actor);

  return clone(lead);
}

async function discardLeadImpl(
  leadId: string,
  actor: CommercialActor,
  reason: string,
): Promise<Lead> {
  const lead = find(leadId);
  if (isLeadClosed(lead.situation)) throw new Error("Lead já encerrado.");

  lead.status = "desqualificado";
  lead.situation = "descartado";
  lead.closingReason = reason.trim();
  lead.request = null;

  appendHistory(
    lead,
    entry(LEAD_EVENTS.disqualified, `Lead descartado: ${lead.closingReason}`, actor),
  );
  audit("descartado", lead, `Lead ${lead.code} descartado.`, actor);

  return clone(lead);
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
async function convertLeadToProposalImpl(
  leadId: string,
  actor: CommercialActor,
): Promise<LeadConversionResult> {
  await applyTemporalRules();

  const lead = find(leadId);
  if (lead.proposalRef) throw new Error("Este Lead já foi convertido.");
  if (!canConvertLead(lead, actor)) {
    throw new Error("O Lead ainda não atende às condições de conversão.");
  }

  proposalSequence += 1;
  const proposalRef = `PRP-SIM-${String(proposalSequence).padStart(4, "0")}`;

  lead.proposalRef = proposalRef;
  lead.status = "convertido";
  lead.situation = "convertido";

  appendHistory(
    lead,
    entry(
      LEAD_EVENTS.converted,
      `Lead convertido em Proposta (vínculo simulado ${proposalRef}).`,
      actor,
    ),
  );
  audit("convertido", lead, `Lead ${lead.code} convertido em Proposta.`, actor);

  return { lead: clone(lead), proposalRef };
}

/* --------------------------- fachada serializada (Server Functions) ------
 * As operações acima executam dentro de run(): carregam o estado do
 * PostgreSQL, aplicam as regras e persistem apenas o que mudou.
 */

export async function listAvailableLeads(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  return run(() => listAvailableLeadsImpl(filters));
}

export async function listMyLeads(
  sellerId: string,
  filters: LeadFilters = {},
): Promise<Paginated<Lead>> {
  return run(() => listMyLeadsImpl(sellerId, filters));
}

export async function listAllLeads(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
  return run(() => listAllLeadsImpl(filters));
}

export async function listPendingRequests(): Promise<Lead[]> {
  return run(() => listPendingRequestsImpl());
}

export async function getLead(leadId: string): Promise<Lead | undefined> {
  return run(() => getLeadImpl(leadId));
}

export async function listAgenda(filters: LeadAgendaFilters = {}): Promise<LeadAgendaItem[]> {
  return run(() => listAgendaImpl(filters));
}

export async function getLeadsSummary(sellerId?: string): Promise<LeadsSummary> {
  return run(() => getLeadsSummaryImpl(sellerId));
}

export async function createLead(input: LeadInput, actor: CommercialActor): Promise<Lead> {
  return run(() => createLeadImpl(input, actor));
}

export async function requestLead(leadId: string, actor: CommercialActor): Promise<Lead> {
  return run(() => requestLeadImpl(leadId, actor));
}

export async function approveRequest(leadId: string, actor: CommercialActor): Promise<Lead> {
  return run(() => approveRequestImpl(leadId, actor));
}

export async function rejectRequest(
  leadId: string,
  actor: CommercialActor,
  justification: string,
): Promise<Lead> {
  return run(() => rejectRequestImpl(leadId, actor, justification));
}

export async function assignLeadDirectly(
  leadId: string,
  actor: CommercialActor,
  input: DirectAssignmentInput,
): Promise<Lead> {
  return run(() => assignLeadDirectlyImpl(leadId, actor, input));
}

export async function registerContact(
  leadId: string,
  actor: CommercialActor,
  input: RegisterContactInput,
): Promise<Lead> {
  return run(() => registerContactImpl(leadId, actor, input));
}

export async function scheduleContact(
  leadId: string,
  actor: CommercialActor,
  input: { scheduledFor: string; description: string },
): Promise<Lead> {
  return run(() => scheduleContactImpl(leadId, actor, input));
}

export async function updateSchedule(
  leadId: string,
  actor: CommercialActor,
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<Lead> {
  return run(() => updateScheduleImpl(leadId, actor, scheduleId, input));
}

export async function removeSchedule(
  leadId: string,
  actor: CommercialActor,
  scheduleId: string,
): Promise<Lead> {
  return run(() => removeScheduleImpl(leadId, actor, scheduleId));
}

export async function addNote(
  leadId: string,
  actor: CommercialActor,
  content: string,
): Promise<Lead> {
  return run(() => addNoteImpl(leadId, actor, content));
}

export async function addFile(
  leadId: string,
  actor: CommercialActor,
  input: { name: string; classification: string; content: Blob },
): Promise<Lead> {
  return run(() => addFileImpl(leadId, actor, input));
}

export async function removeFile(
  leadId: string,
  actor: CommercialActor,
  fileId: string,
): Promise<Lead> {
  return run(() => removeFileImpl(leadId, actor, fileId));
}

export async function markLeadAsLost(
  leadId: string,
  actor: CommercialActor,
  reason: string,
): Promise<Lead> {
  return run(() => markLeadAsLostImpl(leadId, actor, reason));
}

export async function discardLead(
  leadId: string,
  actor: CommercialActor,
  reason: string,
): Promise<Lead> {
  return run(() => discardLeadImpl(leadId, actor, reason));
}

export async function convertLeadToProposal(
  leadId: string,
  actor: CommercialActor,
): Promise<LeadConversionResult> {
  return run(() => convertLeadToProposalImpl(leadId, actor));
}

/** Prazo padrão exposto para a interface — nunca redefinido nos componentes. */
export const LEAD_SERVICE_DEFAULTS = {
  approvalDeadlineHours: LEAD_APPROVAL_DEADLINE_HOURS,
  firstContactHours: LEAD_FIRST_CONTACT_HOURS,
  firstContactDeadlineFrom,
} as const;
