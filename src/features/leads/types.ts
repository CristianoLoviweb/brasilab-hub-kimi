import type { AccessGroupCode } from "@/features/access/types";

/**
 * Domínio do módulo de Leads.
 *
 * Fontes oficiais:
 *  - docs/03_DOMINIO_DO_SISTEMA.md — item 3 (Lead)
 *  - docs/regras_de_negocio/03_STATUS.md — item 4 (Status dos Leads)
 *  - docs/regras_de_negocio/05_HISTORICOS.md — item 7 (Histórico dos Leads)
 *  - docs/regras_de_negocio/06_ARQUIVOS.md
 *  - docs/regras_de_negocio/10_EVENTOS_DO_SISTEMA.md — item 6 (Eventos dos Leads)
 *
 * Duas dimensões distintas convivem no Lead e NUNCA deverão ser confundidas:
 *  1. `status`    — ciclo de vida oficial documentado (Novo → Em Contato → …).
 *  2. `situation` — situação de atendimento (fila comercial): quem detém o Lead.
 */

/** Ciclo de vida oficial (docs/regras_de_negocio/03_STATUS.md — item 4). */
export type LeadStatus =
  | "novo"
  | "em_contato"
  | "qualificado"
  | "convertido"
  | "perdido"
  | "desqualificado";

/** Situação de atendimento — controla a fila comercial. */
export type LeadSituation =
  | "disponivel"
  | "aguardando_aprovacao"
  | "atribuido"
  | "convertido"
  | "perdido"
  | "descartado";

/** Origem da captação. Preparada para captações externas futuras. */
export type LeadOrigin =
  | "landing_page"
  | "site"
  | "whatsapp"
  | "manual"
  | "integracao"
  | "outro";

export type LeadPriority = "baixa" | "normal" | "alta" | "urgente";

/** Canal utilizado no contato registrado. */
export type LeadContactChannel =
  | "ligacao"
  | "whatsapp"
  | "email"
  | "reuniao"
  | "visita"
  | "outro";

/** Resultado do contato — lista centralizada para futura configuração. */
export type LeadContactResult =
  | "contato_realizado"
  | "sem_resposta"
  | "aguardando_informacoes"
  | "solicitou_retorno"
  | "enviara_documentos"
  | "sem_interesse"
  | "oportunidade_qualificada"
  | "outro";

/** Situação de um agendamento comercial. */
export type LeadScheduleStatus = "pendente" | "concluido" | "cancelado" | "expirado";

/** Solicitante da oportunidade. */
export interface LeadRequester {
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
}

/** Interesse comercial declarado. */
export interface LeadInterest {
  product: string;
  description: string;
  installationPlace: string;
  notes: string;
}

/** Registro imutável do Histórico do Lead. */
export interface LeadHistoryEntry {
  id: string;
  /** Código do evento (docs/regras_de_negocio/10_EVENTOS_DO_SISTEMA.md). */
  event: string;
  description: string;
  occurredAt: string;
  actorId: string;
  actorName: string;
  /** Origem da operação. */
  origin: "interface" | "sistema" | "integracao";
}

/** Contato efetivamente realizado com o solicitante. */
export interface LeadContact {
  id: string;
  channel: LeadContactChannel;
  result: LeadContactResult;
  occurredAt: string;
  notes: string;
  nextStep: string;
  authorId: string;
  authorName: string;
}

/** Agendamento comercial (primeiro contato automático e reagendamentos). */
export interface LeadSchedule {
  id: string;
  leadId: string;
  title: string;
  description: string;
  scheduledFor: string;
  status: LeadScheduleStatus;
  /** Identifica o primeiro contato criado automaticamente pelo sistema. */
  isFirstContact: boolean;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}

/** Nota interna — nunca enviada ao solicitante. */
export interface LeadNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string | null;
  /** Visibilidade interna (docs/10_SEGURANCA_DA_INFORMACAO.md). */
  visibility: "interna";
}

/** Metadados do arquivo vinculado (sem Storage real nesta Sprint). */
export interface LeadFile {
  id: string;
  name: string;
  /** Classificação oficial (docs/regras_de_negocio/06_ARQUIVOS.md — item 5). */
  classification: string;
  extension: string;
  sizeInBytes: number;
  uploadedAt: string;
  authorId: string;
  authorName: string;
}

/** Solicitação de atribuição feita por um vendedor. */
export interface LeadAssignmentRequest {
  id: string;
  leadId: string;
  sellerId: string;
  sellerName: string;
  requestedAt: string;
  /** Prazo de decisão do gestor (12 horas corridas). */
  deadlineAt: string;
  status: "pendente" | "aprovada" | "recusada" | "aprovada_automaticamente";
  decidedAt: string | null;
  managerId: string | null;
  managerName: string | null;
  /** Justificativa obrigatória em caso de recusa. */
  justification: string | null;
}

export interface Lead {
  id: string;
  /** Código oficial gerado pela plataforma (docs/regras_de_negocio/01_NUMERACAO.md). */
  code: string;
  status: LeadStatus;
  situation: LeadSituation;
  origin: LeadOrigin;
  priority: LeadPriority;
  requester: LeadRequester;
  interest: LeadInterest;
  createdAt: string;
  /** Vendedor responsável atual. */
  ownerId: string | null;
  ownerName: string | null;
  assignedAt: string | null;
  /** Gestor responsável pela última decisão de atribuição. */
  managerId: string | null;
  managerName: string | null;
  /** Solicitação pendente, quando existir. */
  request: LeadAssignmentRequest | null;
  schedules: LeadSchedule[];
  contacts: LeadContact[];
  notes: LeadNote[];
  files: LeadFile[];
  history: LeadHistoryEntry[];
  /** Vínculo simulado com a Proposta gerada (Sprint 04). */
  proposalRef: string | null;
  /** Motivo do encerramento (perdido/descartado) ou da devolução à fila. */
  closingReason: string | null;
}

/** Entrada do cadastro manual de Lead. */
export interface LeadInput {
  requester: LeadRequester;
  interest: LeadInterest;
  origin: LeadOrigin;
  priority: LeadPriority;
  /** Atribuição imediata no cadastro (somente com permissão). */
  assignToSellerId?: string | null;
}

/** Ator comercial simulado (vendedor ou gestor) — Sprint 03. */
export interface CommercialActor {
  id: string;
  name: string;
  groupCode: AccessGroupCode;
  profileId: string;
  /** Verdadeiro quando o Perfil possui atribuição de gestão comercial. */
  isManager: boolean;
}
