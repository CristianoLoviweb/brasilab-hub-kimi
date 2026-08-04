import type { AccessGroupCode } from "@/features/access/types";
import type { PermissionMatrix } from "@/features/permissions/types";

/**
 * Grupo — representa uma grande área (setor) da empresa.
 * Fonte: docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md — item 4.
 *
 * Grupo NÃO é Perfil: o Grupo define a área; o Perfil define o cargo/função
 * exercido dentro dela.
 */
export interface Group {
  code: AccessGroupCode;
  name: string;
  description: string;
  /** Responsável pela área. */
  manager: string;
  email: string;
  active: boolean;
  createdAt: string;
  /** Módulos liberados (slugs de src/config/navigation.ts). */
  modules: string[];
  /** Permissões gerais base do Grupo. */
  permissions: PermissionMatrix;
}

export interface GroupInput {
  code: AccessGroupCode;
  name: string;
  description: string;
  manager: string;
  email: string;
  active: boolean;
  modules: string[];
}
