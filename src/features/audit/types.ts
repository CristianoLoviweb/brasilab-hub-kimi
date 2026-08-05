import type { AccessGroupCode } from "@/features/access/types";

/**
 * Auditoria — registro cronológico e imutável das ações da plataforma.
 * Fontes:
 *  - docs/regras_de_negocio/05_HISTORICOS.md
 *  - docs/regras_de_negocio/10_EVENTOS_DO_SISTEMA.md
 *
 * Regras invioláveis:
 *  - o registro NUNCA poderá ser alterado;
 *  - o registro NUNCA poderá ser excluído;
 *  - sempre registra usuário, data/hora e ação realizada.
 */

/** Entidades auditáveis previstas. */
export type AuditEntity =
  "usuario" | "grupo" | "perfil" | "permissao" | "sessao" | "dashboard" | "lead";

/** Ações auditáveis (nomenclatura entidade.acao). */
export type AuditAction =
  | "criado"
  | "atualizado"
  | "excluido"
  | "ativado"
  | "inativado"
  | "bloqueado"
  | "login"
  | "logout"
  | "senha_redefinida"
  | "permissao_alterada"
  | "configuracao_alterada"
  | "solicitado"
  | "atribuido"
  | "aprovado"
  | "recusado"
  | "liberado"
  | "contato_registrado"
  | "agendado"
  | "agendamento_editado"
  | "agendamento_excluido"
  | "nota_adicionada"
  | "arquivo_adicionado"
  | "arquivo_removido"
  | "convertido"
  | "perdido"
  | "descartado";

export const AUDIT_ENTITY_LABELS: Record<AuditEntity, string> = {
  usuario: "Usuário",
  grupo: "Grupo",
  perfil: "Perfil",
  permissao: "Permissão",
  sessao: "Sessão",
  dashboard: "Dashboard",
  lead: "Lead",
};

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  criado: "Criado",
  atualizado: "Atualizado",
  excluido: "Excluído",
  ativado: "Ativado",
  inativado: "Inativado",
  bloqueado: "Bloqueado",
  login: "Login",
  logout: "Logout",
  senha_redefinida: "Senha redefinida",
  permissao_alterada: "Permissão alterada",
  configuracao_alterada: "Configuração alterada",
  solicitado: "Solicitado",
  atribuido: "Atribuído",
  aprovado: "Aprovado",
  recusado: "Recusado",
  liberado: "Devolvido à fila",
  contato_registrado: "Contato registrado",
  agendado: "Contato agendado",
  agendamento_editado: "Agendamento editado",
  agendamento_excluido: "Agendamento excluído",
  nota_adicionada: "Nota adicionada",
  arquivo_adicionado: "Arquivo adicionado",
  arquivo_removido: "Arquivo removido",
  convertido: "Convertido",
  perdido: "Perdido",
  descartado: "Descartado",
};

/** Severidade utilizada apenas para leitura visual do evento. */
export type AuditSeverity = "informativo" | "atencao" | "critico";

export interface AuditEvent {
  id: string;
  /** Código do evento no formato entidade.acao. */
  code: `${AuditEntity}.${AuditAction}`;
  entity: AuditEntity;
  action: AuditAction;
  /** Identificador do registro afetado. */
  entityId: string;
  /** Descrição legível do que ocorreu. */
  description: string;
  severity: AuditSeverity;
  occurredAt: string;
  actorId: string;
  actorName: string;
  actorGroup: AccessGroupCode;
  /** Origem da ação (interface, importação, rotina automática). */
  origin: "interface" | "importacao" | "sistema";
}
