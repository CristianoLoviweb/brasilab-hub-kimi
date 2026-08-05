import type { ListParams, Paginated } from "@/lib/query";
import {
  changeUserStatusFn,
  countUsersByFn,
  createUserFn,
  deleteUserFn,
  getUserFn,
  getUsersSummaryFn,
  listUsersFn,
  updateUserFn,
} from "@/server/fns/adminFns";

import type { User, UserInput, UserStatus } from "../types";

/**
 * Service de Usuários (Sprint 03.2).
 * Assinaturas homologadas preservadas; as operações executam no servidor
 * com persistência real no PostgreSQL e auditoria do ator da sessão.
 */

export interface UserFilters extends ListParams {
  status?: UserStatus | "todos";
  groupCode?: string | "todos";
  profileId?: string | "todos";
}

export async function listUsers(filters: UserFilters = {}): Promise<Paginated<User>> {
  return listUsersFn({ data: filters });
}

export async function getUser(id: string): Promise<User | undefined> {
  return getUserFn({ data: id });
}

/**
 * Cadastro de usuário. O servidor gera uma senha temporária aleatória,
 * retornada UMA única vez nesta resposta (campo `temporaryPassword`) para
 * entrega ao novo usuário — somente o hash argon2id é persistido.
 */
export async function createUser(input: UserInput): Promise<User & { temporaryPassword?: string }> {
  const { user, temporaryPassword } = await createUserFn({ data: input });
  return { ...user, temporaryPassword };
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  return updateUserFn({ data: { id, input } });
}

export async function changeUserStatus(id: string, status: UserStatus): Promise<User> {
  return changeUserStatusFn({ data: { id, status } });
}

/**
 * Exclusão de usuário — operação crítica.
 * Exige a Permissão Especial `usuario.excluir`
 * (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md).
 */
export async function deleteUser(id: string): Promise<void> {
  await deleteUserFn({ data: id });
}

export async function getUsersSummary(): Promise<{
  total: number;
  ativos: number;
  inativos: number;
  bloqueados: number;
}> {
  return getUsersSummaryFn();
}

/** Contagem de usuários por grupo — utilizada nas telas de Grupos e Perfis. */
export async function countUsersBy(
  key: "groupCode" | "profileId",
): Promise<Record<string, number>> {
  return countUsersByFn({ data: key });
}
