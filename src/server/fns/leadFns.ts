import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  LEAD_PERMISSIONS,
  type LeadPermissionCode,
} from "@/features/leads/constants/leadPermissions";
import type { LeadFilters, LeadAgendaFilters } from "@/features/leads/services/leadService";

import { assertLeadPermission, buildCommercialActor } from "../auth/actor";
import type { CommercialActor } from "@/features/leads/types";
import * as leadService from "../services/leadService.server";
import { requireUser } from "./context";

/**
 * Server Functions do módulo de Leads (Sprint 03.2).
 *
 * Cada operação: (1) exige sessão válida; (2) deriva o ator da sessão —
 * o ator informado pelo cliente é ignorado; (3) confere a permissão do
 * módulo NO SERVIDOR (mesma regra que a interface aplica); (4) valida a
 * entrada com zod; (5) executa a regra de negócio homologada.
 */

async function requireActor(permission?: LeadPermissionCode): Promise<CommercialActor> {
  const user = await requireUser();
  const actor = buildCommercialActor(user);
  if (permission) assertLeadPermission(actor, permission);
  return actor;
}

/* ------------------------------------------------------------ validações */

const filtersSchema = z
  .object({
    search: z.string().max(200).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(1000).optional(),
    situation: z.string().optional(),
    origin: z.string().optional(),
    priority: z.string().optional(),
    ownerId: z.string().optional(),
    sort: z.enum(["recentes", "antigos", "prioridade"]).optional(),
  })
  .passthrough();

const requesterSchema = z.object({
  name: z.string().min(3).max(120),
  company: z.string().max(120),
  email: z.string().email().or(z.literal("")),
  phone: z.string().max(30),
  whatsapp: z.string().max(30),
  city: z.string().max(120),
  state: z.string().max(2),
});

const interestSchema = z.object({
  product: z.string().max(120),
  description: z.string().max(600),
  installationPlace: z.string().max(120),
  notes: z.string().max(600),
});

const createLeadSchema = z.object({
  requester: requesterSchema,
  interest: interestSchema,
  origin: z.enum(["landing_page", "site", "whatsapp", "manual", "integracao", "outro"]),
  priority: z.enum(["baixa", "normal", "alta", "urgente"]),
  assignToSellerId: z.string().nullish(),
});

const directAssignmentSchema = z.object({
  sellerId: z.string().min(1),
  sellerName: z.string().min(1),
  firstContactHours: z.number().min(1).max(720),
  priority: z.enum(["baixa", "normal", "alta", "urgente"]),
  observation: z.string().max(600).optional(),
});

const registerContactSchema = z.object({
  channel: z.enum(["ligacao", "whatsapp", "email", "reuniao", "visita", "outro"]),
  result: z.enum([
    "contato_realizado",
    "sem_resposta",
    "aguardando_informacoes",
    "solicitou_retorno",
    "enviara_documentos",
    "sem_interesse",
    "oportunidade_qualificada",
    "outro",
  ]),
  notes: z.string().min(3).max(600),
  nextStep: z.string().max(300).optional(),
  nextScheduleAt: z.string().optional(),
  nextScheduleDescription: z.string().max(300).optional(),
});

const scheduleContactSchema = z.object({
  scheduledFor: z.string().min(1),
  description: z.string().min(3).max(300),
});

const updateScheduleSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(300),
  scheduledFor: z.string().min(1),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  status: z.enum(["pendente", "concluido", "cancelado", "expirado"]),
});

const idSchema = z.string().min(1).max(60);
const textSchema = (max: number) => z.string().trim().min(1).max(max);

/* ---------------------------------------------------------------- leitura */

export const listAvailableLeadsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => filtersSchema.parse(data ?? {}) as LeadFilters)
  .handler(async ({ data }) => {
    await requireActor(LEAD_PERMISSIONS.visualizarDisponiveis);
    return leadService.listAvailableLeads(data);
  });

export const listMyLeadsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => filtersSchema.parse(data ?? {}) as LeadFilters)
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.visualizarProprios);
    return leadService.listMyLeads(actor.id, data);
  });

export const listAllLeadsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => filtersSchema.parse(data ?? {}) as LeadFilters)
  .handler(async ({ data }) => {
    await requireActor(LEAD_PERMISSIONS.visualizarTodos);
    return leadService.listAllLeads(data);
  });

export const listPendingRequestsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireActor(LEAD_PERMISSIONS.aprovarAtribuicao);
  return leadService.listPendingRequests();
});

export const getLeadFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    await requireActor();
    return leadService.getLead(data);
  });

export const listAgendaFn = createServerFn({ method: "GET" })
  .inputValidator(
    (data: unknown) =>
      z.object({ ownerId: z.string().optional() }).parse(data ?? {}) as LeadAgendaFilters,
  )
  .handler(async ({ data }) => {
    await requireActor();
    return leadService.listAgenda(data);
  });

export const getLeadsSummaryFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ sellerId: z.string().optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    await requireActor();
    return leadService.getLeadsSummary(data.sellerId);
  });

/* ---------------------------------------------------------------- escrita */

export const createLeadFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.criar);
    if (data.assignToSellerId) assertLeadPermission(actor, LEAD_PERMISSIONS.atribuirDiretamente);
    return leadService.createLead(data, actor);
  });

export const requestLeadFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.solicitar);
    return leadService.requestLead(data, actor);
  });

export const approveRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.aprovarAtribuicao);
    return leadService.approveRequest(data, actor);
  });

export const rejectRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, justification: textSchema(600) }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.recusarAtribuicao);
    return leadService.rejectRequest(data.leadId, actor, data.justification);
  });

export const assignLeadDirectlyFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, input: directAssignmentSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.atribuirDiretamente);
    return leadService.assignLeadDirectly(data.leadId, actor, data.input);
  });

export const registerContactFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, input: registerContactSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.registrarContato);
    return leadService.registerContact(data.leadId, actor, data.input);
  });

export const scheduleContactFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, input: scheduleContactSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.agendarContato);
    return leadService.scheduleContact(data.leadId, actor, data.input);
  });

export const updateScheduleFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, scheduleId: idSchema, input: updateScheduleSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.agendarContato);
    return leadService.updateSchedule(data.leadId, actor, data.scheduleId, data.input);
  });

export const removeScheduleFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, scheduleId: idSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.agendarContato);
    return leadService.removeSchedule(data.leadId, actor, data.scheduleId);
  });

export const addNoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, content: textSchema(600) }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.adicionarNota);
    return leadService.addNote(data.leadId, actor, data.content);
  });

export const removeFileFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, fileId: z.string().min(1).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.adicionarArquivo);
    return leadService.removeFile(data.leadId, actor, data.fileId);
  });

export const markLeadAsLostFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, reason: textSchema(600) }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.marcarPerdido);
    return leadService.markLeadAsLost(data.leadId, actor, data.reason);
  });

export const discardLeadFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ leadId: idSchema, reason: textSchema(600) }).parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.descartar);
    return leadService.discardLead(data.leadId, actor, data.reason);
  });

export const convertLeadToProposalFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const actor = await requireActor(LEAD_PERMISSIONS.converterProposta);
    return leadService.convertLeadToProposal(data, actor);
  });
