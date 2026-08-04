import type { StatusTone } from "@/components/common/StatusBadge";

import type {
  LeadContactChannel,
  LeadContactResult,
  LeadOrigin,
  LeadPriority,
  LeadScheduleStatus,
  LeadSituation,
  LeadStatus,
} from "../types";

/**
 * Catálogo centralizado do domínio de Leads.
 *
 * Nenhum componente deverá declarar rótulos, listas ou tonalidades próprias:
 * toda a interface consome exclusivamente este arquivo
 * (docs/07_PADROES_DE_DESENVOLVIMENTO.md — reutilização e centralização).
 */

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  em_contato: "Em Contato",
  qualificado: "Qualificado",
  convertido: "Convertido",
  perdido: "Perdido",
  desqualificado: "Desqualificado",
};

export const LEAD_STATUS_TONE: Record<LeadStatus, StatusTone> = {
  novo: "info",
  em_contato: "warning",
  qualificado: "success",
  convertido: "success",
  perdido: "danger",
  desqualificado: "neutral",
};

export const LEAD_SITUATION_LABELS: Record<LeadSituation, string> = {
  disponivel: "Disponível",
  aguardando_aprovacao: "Aguardando Aprovação",
  atribuido: "Atribuído",
  convertido: "Convertido",
  perdido: "Perdido",
  descartado: "Descartado",
};

export const LEAD_SITUATION_TONE: Record<LeadSituation, StatusTone> = {
  disponivel: "info",
  aguardando_aprovacao: "warning",
  atribuido: "success",
  convertido: "success",
  perdido: "danger",
  descartado: "neutral",
};

export const LEAD_ORIGIN_LABELS: Record<LeadOrigin, string> = {
  landing_page: "Landing Page",
  site: "Site institucional",
  whatsapp: "WhatsApp",
  manual: "Cadastro manual",
  integracao: "Integração",
  outro: "Outra origem",
};

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
  urgente: "Urgente",
};

export const LEAD_PRIORITY_TONE: Record<LeadPriority, StatusTone> = {
  baixa: "neutral",
  normal: "info",
  alta: "warning",
  urgente: "danger",
};

export const LEAD_CONTACT_CHANNEL_LABELS: Record<LeadContactChannel, string> = {
  ligacao: "Ligação",
  whatsapp: "WhatsApp",
  email: "E-mail",
  reuniao: "Reunião",
  visita: "Visita",
  outro: "Outro",
};

export const LEAD_CONTACT_RESULT_LABELS: Record<LeadContactResult, string> = {
  contato_realizado: "Contato realizado",
  sem_resposta: "Sem resposta",
  aguardando_informacoes: "Aguardando informações",
  solicitou_retorno: "Solicitou retorno",
  enviara_documentos: "Enviará documentos",
  sem_interesse: "Sem interesse",
  oportunidade_qualificada: "Oportunidade qualificada",
  outro: "Outro",
};

/**
 * Resultados que caracterizam contato efetivamente realizado com o solicitante.
 * Utilizados para concluir o primeiro atendimento e habilitar a conversão.
 */
export const LEAD_EFFECTIVE_CONTACT_RESULTS: LeadContactResult[] = [
  "contato_realizado",
  "aguardando_informacoes",
  "solicitou_retorno",
  "enviara_documentos",
  "sem_interesse",
  "oportunidade_qualificada",
];

export const LEAD_SCHEDULE_STATUS_LABELS: Record<LeadScheduleStatus, string> = {
  pendente: "Pendente",
  concluido: "Concluído",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

export const LEAD_SCHEDULE_STATUS_TONE: Record<LeadScheduleStatus, StatusTone> = {
  pendente: "info",
  concluido: "success",
  cancelado: "neutral",
  expirado: "danger",
};

/** Classificações de arquivo aplicáveis ao Lead (docs/.../06_ARQUIVOS.md). */
export const LEAD_FILE_CLASSIFICATIONS: string[] = [
  "Documento Comercial",
  "Documento Técnico",
  "Projeto",
  "Foto",
  "Arquivo Geral",
];

/** Situações que mantêm o Lead na fila pública de disponíveis. */
export const LEAD_AVAILABLE_SITUATIONS: LeadSituation[] = ["disponivel"];

/** Situações encerradas — nenhuma ação comercial adicional é permitida. */
export const LEAD_CLOSED_SITUATIONS: LeadSituation[] = [
  "convertido",
  "perdido",
  "descartado",
];

export function isLeadClosed(situation: LeadSituation): boolean {
  return LEAD_CLOSED_SITUATIONS.includes(situation);
}
