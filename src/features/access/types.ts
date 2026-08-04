/**
 * Estrutura simulada de Grupos de Acesso (Ajustes finais da Sprint 01).
 *
 * ATENÇÃO: nesta etapa NÃO existem usuários, grupos ou permissões reais.
 * Toda a estrutura abaixo é apenas a preparação arquitetural para a Sprint 02,
 * quando os Grupos, Perfis e Permissões passarão a vir do backend e serão
 * validados no servidor (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */

export type AccessGroupCode =
  | "administracao"
  | "diretoria"
  | "comercial"
  | "financeiro"
  | "producao"
  | "compras"
  | "logistica"
  | "engenharia";

/** Ações genéricas previstas para o controle futuro de módulos. */
export type ModuleAction =
  | "visualizar"
  | "criar"
  | "editar"
  | "excluir"
  | "aprovar"
  | "cancelar"
  | "exportar"
  | "importar"
  | "imprimir"
  | "administrar"
  | "arquivos";

/** Permissões de um módulo dentro de um Grupo de Acesso. */
export type ModulePermissions = Partial<Record<ModuleAction, boolean>>;

export interface AccessGroup {
  code: AccessGroupCode;
  label: string;
  description: string;
  /** Slugs de módulos (src/config/navigation.ts) liberados para o Grupo. */
  modules: string[];
  /** Permissões por módulo — preenchidas futuramente pelo Administrador. */
  permissions: Record<string, ModulePermissions>;
}
