import type { AccessGroupCode } from "@/features/access/types";
import type { SpecialPermissionCode } from "@/features/permissions/types";

/** Situação do usuário na plataforma. */
export type UserStatus = "ativo" | "inativo" | "bloqueado";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  bloqueado: "Bloqueado",
};

/**
 * Usuário — pessoa autorizada a utilizar a Intranet
 * (docs/03_DOMINIO_DO_SISTEMA.md — item 11).
 *
 * Todo usuário pertence a um Grupo (setor) e possui um Perfil (função).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Matrícula interna. */
  registration: string;
  position: string;
  groupCode: AccessGroupCode;
  profileId: string;
  status: UserStatus;
  createdAt: string;
  lastAccessAt: string | null;
  notes?: string;
  /** Permissões Especiais concedidas diretamente ao usuário. */
  specialPermissions: SpecialPermissionCode[];
}

export interface UserInput {
  name: string;
  email: string;
  phone: string;
  registration: string;
  position: string;
  groupCode: AccessGroupCode;
  profileId: string;
  status: UserStatus;
  notes?: string;
  specialPermissions: SpecialPermissionCode[];
}
