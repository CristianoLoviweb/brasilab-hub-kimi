import type { ModuleAction, ModulePermissions } from "@/features/access/types";

export type { ModuleAction, ModulePermissions };

/**
 * Arquitetura de Permissões da plataforma.
 *
 * Hierarquia oficial (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md):
 *
 *   Usuário → Grupo → Perfil → Permissões Gerais → Permissões Especiais
 *
 * Nesta Sprint nenhuma permissão é aplicada de forma real: apenas a estrutura
 * está construída. A validação definitiva ocorrerá SEMPRE no backend
 * (docs/10_SEGURANCA_DA_INFORMACAO.md); a camada de interface é apenas
 * apresentação.
 */

/** Permissões gerais por módulo (slug de src/config/navigation.ts). */
export type PermissionMatrix = Record<string, ModulePermissions>;

/**
 * Sobrescrita de permissões de um Perfil sobre o Grupo.
 * `granted` libera ações adicionais; `revoked` restringe ações do Grupo.
 * Uma sobrescrita NUNCA concede acesso a módulo não liberado ao Grupo.
 */
export interface PermissionOverride {
  granted?: PermissionMatrix;
  revoked?: PermissionMatrix;
  /** Módulos adicionais dentro do escopo do Grupo (nunca fora dele). */
  modules?: string[];
}

/** Códigos oficiais das Permissões Especiais (operações críticas). */
export type SpecialPermissionCode =
  | "proposta.aprovar"
  | "proposta.cancelar"
  | "proposta.converter"
  | "proposta.anular_revisao"
  | "pedido.cancelar"
  | "pedido.alterar_aprovado"
  | "producao.liberar"
  | "producao.reabrir"
  | "compra.aprovar"
  | "financeiro.alterar_valores"
  | "financeiro.estornar"
  | "dados.custos"
  | "dados.confidenciais"
  | "arquivos.excluir"
  | "usuario.excluir"
  | "usuario.resetar_senha"
  | "permissoes.alterar";

export interface SpecialPermission {
  code: SpecialPermissionCode;
  label: string;
  description: string;
  /** Módulo ao qual a operação crítica pertence. */
  module: string;
}

/** Origem de uma permissão — usada futuramente pela tela administrativa. */
export type PermissionSource = "grupo" | "perfil" | "especial";

/** Resultado consolidado da hierarquia Grupo → Perfil → Especiais. */
export interface EffectivePermissions {
  modules: string[];
  matrix: PermissionMatrix;
  special: SpecialPermissionCode[];
  can: (module: string, action: ModuleAction) => boolean;
  hasSpecial: (code: SpecialPermissionCode) => boolean;
  canAccessModule: (module: string) => boolean;
}
