/**
 * Eventos padronizados do módulo de Leads.
 * Nomenclatura oficial: entidade.acao
 * (docs/regras_de_negocio/10_EVENTOS_DO_SISTEMA.md — itens 5 e 6).
 *
 * Nenhum evento deverá possuir significado duplicado.
 */
export const LEAD_EVENTS = {
  created: "lead.created",
  captured: "lead.captured",
  requested: "lead.requested",
  assignmentApproved: "lead.assignment.approved",
  assignmentRejected: "lead.assignment.rejected",
  assignmentAutoApproved: "lead.assignment.auto_approved",
  assigned: "lead.assigned",
  released: "lead.released",
  firstContactScheduled: "lead.first_contact.scheduled",
  firstContactExpired: "lead.first_contact.expired",
  contactCreated: "lead.contact.created",
  contactRescheduled: "lead.contact.rescheduled",
  noteCreated: "lead.note.created",
  fileAdded: "lead.file.added",
  statusChanged: "lead.status.changed",
  lost: "lead.lost",
  disqualified: "lead.disqualified",
  converted: "lead.converted",
} as const;

export type LeadEventCode = (typeof LEAD_EVENTS)[keyof typeof LEAD_EVENTS];

export const LEAD_EVENT_LABELS: Record<LeadEventCode, string> = {
  "lead.created": "Lead cadastrado",
  "lead.captured": "Lead captado",
  "lead.requested": "Lead solicitado",
  "lead.assignment.approved": "Solicitação aprovada",
  "lead.assignment.rejected": "Solicitação recusada",
  "lead.assignment.auto_approved": "Aprovação automática por expiração do prazo",
  "lead.assigned": "Lead atribuído",
  "lead.released": "Lead devolvido à fila",
  "lead.first_contact.scheduled": "Primeiro contato agendado",
  "lead.first_contact.expired": "Primeiro contato vencido",
  "lead.contact.created": "Contato registrado",
  "lead.contact.rescheduled": "Contato reagendado",
  "lead.note.created": "Nota interna adicionada",
  "lead.file.added": "Arquivo adicionado",
  "lead.status.changed": "Status alterado",
  "lead.lost": "Lead perdido",
  "lead.disqualified": "Lead descartado",
  "lead.converted": "Lead convertido em Proposta",
};
