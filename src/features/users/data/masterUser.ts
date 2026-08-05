import { SPECIAL_PERMISSIONS } from "@/features/permissions/config/specialPermissions";
import type { SpecialPermissionCode } from "@/features/permissions/types";

import type { User } from "../types";

/**
 * Usuário Administrador Master — único usuário inicial da plataforma.
 *
 * Criado na Sprint 03.1 (Preparação do Projeto para Ambiente Real), após a
 * remoção de todos os dados fictícios utilizados nas Sprints 01–03.
 *
 * Pertence ao Grupo Administração e ao Perfil Master, com acesso total a
 * todos os módulos e todas as Permissões Especiais
 * (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md).
 */
export const MASTER_USER_ID = "USR-0001";
export const MASTER_PROFILE_ID = "PRF-001";
export const MASTER_USER_EMAIL = "brasilab@brasilab.com.br";

/** Todas as Permissões Especiais do catálogo oficial. */
export const MASTER_SPECIAL_PERMISSIONS: SpecialPermissionCode[] = SPECIAL_PERMISSIONS.map(
  (permission) => permission.code,
);

export const MASTER_USER: User = {
  id: MASTER_USER_ID,
  name: "Administrador Master",
  email: MASTER_USER_EMAIL,
  phone: "",
  registration: "BRL-0001",
  position: "Administrador da Plataforma",
  groupCode: "administracao",
  profileId: MASTER_PROFILE_ID,
  status: "ativo",
  createdAt: "2026-08-05T00:00:00.000Z",
  lastAccessAt: null,
  notes: "Usuário inicial da plataforma, criado na Sprint 03.1.",
  specialPermissions: MASTER_SPECIAL_PERMISSIONS,
};
