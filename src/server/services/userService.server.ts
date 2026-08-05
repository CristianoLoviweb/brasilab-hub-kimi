import { randomBytes } from "node:crypto";

import { matchesSearch, paginate } from "@/lib/query";
import type { User, UserInput, UserStatus } from "@/features/users/types";

import { hashPassword } from "../auth/password";
import {
  deleteUserRow,
  insertUser,
  loadUsers,
  nextUserSequence,
  updateUserRow,
} from "../repositories/adminRepositories";
import { registerAuditEvent, type AuditInput } from "./auditService.server";

/**
 * Service de Usuários no servidor (Sprint 03.2).
 * Mesma lógica homologada — agora com persistência real no PostgreSQL e
 * senha inicial segura para novos usuários (hash argon2id).
 */

export interface UserFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: UserStatus | "todos";
  groupCode?: string | "todos";
  profileId?: string | "todos";
}

type AuditActor = Pick<AuditInput, "actorId" | "actorName" | "actorGroup">;

export async function listUsers(filters: UserFilters = {}) {
  const store = await loadUsers();

  const rows = store
    .filter((user) =>
      filters.status && filters.status !== "todos" ? user.status === filters.status : true,
    )
    .filter((user) =>
      filters.groupCode && filters.groupCode !== "todos"
        ? user.groupCode === filters.groupCode
        : true,
    )
    .filter((user) =>
      filters.profileId && filters.profileId !== "todos"
        ? user.profileId === filters.profileId
        : true,
    )
    .filter((user) =>
      matchesSearch(filters.search, user.name, user.email, user.registration, user.position),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return paginate(rows, filters.page, filters.pageSize);
}

export async function getUser(id: string): Promise<User | undefined> {
  const store = await loadUsers();
  return store.find((user) => user.id === id);
}

/**
 * Cadastro de usuário com credencial real: uma senha temporária aleatória
 * é gerada e retornada UMA ÚNICA VEZ ao administrador (jamais gravada em
 * texto puro — somente o hash argon2id é persistido).
 */
export async function createUser(
  input: UserInput,
  actor: AuditActor,
): Promise<{ user: User; temporaryPassword: string }> {
  const sequence = await nextUserSequence();
  const user: User = {
    ...input,
    id: `USR-${String(sequence + 1).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
    lastAccessAt: null,
  };

  const temporaryPassword = randomBytes(6).toString("base64url");
  await insertUser(user, await hashPassword(temporaryPassword));

  await registerAuditEvent({
    entity: "usuario",
    action: "criado",
    entityId: user.id,
    description: `Usuário ${user.name} cadastrado.`,
    ...actor,
  });

  return { user, temporaryPassword };
}

export async function updateUser(id: string, input: UserInput, actor: AuditActor): Promise<User> {
  const store = await loadUsers();
  const previous = store.find((user) => user.id === id);
  if (!previous) throw new Error("Usuário não encontrado.");

  const updated: User = { ...previous, ...input };
  await updateUserRow(updated);

  await registerAuditEvent({
    entity: "usuario",
    action: "atualizado",
    entityId: id,
    description: `Usuário ${updated.name} atualizado.`,
    severity: previous.profileId === updated.profileId ? "informativo" : "atencao",
    ...actor,
  });

  return updated;
}

export async function changeUserStatus(
  id: string,
  status: UserStatus,
  actor: AuditActor,
): Promise<User> {
  const store = await loadUsers();
  const current = store.find((user) => user.id === id);
  if (!current) throw new Error("Usuário não encontrado.");

  const updated: User = { ...current, status };
  await updateUserRow(updated);

  await registerAuditEvent({
    entity: "usuario",
    action: status === "ativo" ? "ativado" : status === "inativo" ? "inativado" : "bloqueado",
    entityId: id,
    description: `Usuário ${updated.name} teve a situação alterada para ${status}.`,
    severity: status === "bloqueado" ? "critico" : "atencao",
    ...actor,
  });

  return updated;
}

/**
 * Exclusão de usuário — operação crítica.
 * Exige a Permissão Especial `usuario.excluir`
 * (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md).
 */
export async function deleteUser(id: string, actor: AuditActor): Promise<void> {
  const store = await loadUsers();
  const removed = store.find((user) => user.id === id);
  if (!removed) throw new Error("Usuário não encontrado.");

  await deleteUserRow(id);

  await registerAuditEvent({
    entity: "usuario",
    action: "excluido",
    entityId: id,
    description: `Usuário ${removed.name} excluído da plataforma.`,
    severity: "critico",
    ...actor,
  });
}

export async function getUsersSummary(): Promise<{
  total: number;
  ativos: number;
  inativos: number;
  bloqueados: number;
}> {
  const store = await loadUsers();
  return {
    total: store.length,
    ativos: store.filter((user) => user.status === "ativo").length,
    inativos: store.filter((user) => user.status === "inativo").length,
    bloqueados: store.filter((user) => user.status === "bloqueado").length,
  };
}

/** Contagem de usuários por grupo — utilizada nas telas de Grupos e Perfis. */
export async function countUsersBy(
  key: "groupCode" | "profileId",
): Promise<Record<string, number>> {
  const store = await loadUsers();
  return store.reduce<Record<string, number>>((acc, user) => {
    const value = user[key];
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}
