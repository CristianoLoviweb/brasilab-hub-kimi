import type { AccessGroupCode } from "@/features/access/types";
import type {
  PermissionOverride,
  SpecialPermissionCode,
} from "@/features/permissions/types";

/**
 * Perfil — representa o cargo/função exercido pelo usuário dentro de um Grupo.
 * Fonte: docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md — item 5.
 *
 * Exemplo:
 *   Grupo Comercial → Perfis: Vendedor, Supervisor Comercial, Gerente Comercial.
 */
export interface Profile {
  id: string;
  name: string;
  description: string;
  /** Grupo (setor) ao qual o Perfil pertence. */
  groupCode: AccessGroupCode;
  /** Nível hierárquico dentro do Grupo (1 = operacional … 5 = direção). */
  level: 1 | 2 | 3 | 4 | 5;
  active: boolean;
  createdAt: string;
  /** Sobrescrita das permissões gerais do Grupo. */
  override: PermissionOverride;
  /** Permissões Especiais atribuídas ao Perfil. */
  specialPermissions: SpecialPermissionCode[];
}

export interface ProfileInput {
  name: string;
  description: string;
  groupCode: AccessGroupCode;
  level: 1 | 2 | 3 | 4 | 5;
  active: boolean;
  specialPermissions: SpecialPermissionCode[];
}

export const PROFILE_LEVEL_LABELS: Record<Profile["level"], string> = {
  1: "Operacional",
  2: "Analítico",
  3: "Supervisão",
  4: "Gerência",
  5: "Direção",
};
