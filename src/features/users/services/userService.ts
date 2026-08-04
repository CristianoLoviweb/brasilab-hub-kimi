import { delay, matchesSearch, paginate } from "@/lib/query";
import type { ListParams, Paginated } from "@/lib/query";
import { registerAuditEvent } from "@/features/audit/services/auditService";

import { MOCK_USERS } from "../data/mockUsers";
import type { User, UserInput, UserStatus } from "../types";

/**
 * DEVELOPMENT ONLY (dados simulados)
 * CRUD em memória. Na Sprint de backend estas funções manterão exatamente a
 * mesma assinatura, passando a consultar o banco de dados.
 */
const store: User[] = [...MOCK_USERS];

let sequence = store.length;

function nextId(): string {
  sequence += 1;
  return `USR-${String(sequence).padStart(4, "0")}`;
}

export interface UserFilters extends ListParams {
  status?: UserStatus | "todos";
  groupCode?: string | "todos";
  profileId?: string | "todos";
}

export async function listUsers(filters: UserFilters = {}): Promise<Paginated<User>> {
  await delay();

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
      matchesSearch(
        filters.search,
        user.name,
        user.email,
        user.registration,
        user.position,
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return paginate(rows, filters.page, filters.pageSize);
}

export async function getUser(id: string): Promise<User | undefined> {
  await delay(120);
  return store.find((user) => user.id === id);
}

export async function createUser(input: UserInput): Promise<User> {
  await delay();

  const user: User = {
    ...input,
    id: nextId(),
    createdAt: new Date().toISOString(),
    lastAccessAt: null,
  };

  store.push(user);
  registerAuditEvent({
    entity: "usuario",
    action: "criado",
    entityId: user.id,
    description: `Usuário ${user.name} cadastrado.`,
  });

  return user;
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  await delay();

  const index = store.findIndex((user) => user.id === id);
  if (index < 0) throw new Error("Usuário não encontrado.");

  const previous = store[index];
  if (!previous) throw new Error("Usuário não encontrado.");

  const updated: User = { ...previous, ...input };
  store[index] = updated;

  registerAuditEvent({
    entity: "usuario",
    action: "atualizado",
    entityId: id,
    description: `Usuário ${updated.name} atualizado.`,
    severity: previous.profileId === updated.profileId ? "informativo" : "atencao",
  });

  return updated;
}

export async function changeUserStatus(id: string, status: UserStatus): Promise<User> {
  await delay(140);

  const index = store.findIndex((user) => user.id === id);
  if (index < 0) throw new Error("Usuário não encontrado.");

  const current = store[index];
  if (!current) throw new Error("Usuário não encontrado.");

  const updated: User = { ...current, status };
  store[index] = updated;

  registerAuditEvent({
    entity: "usuario",
    action: status === "ativo" ? "ativado" : status === "inativo" ? "inativado" : "bloqueado",
    entityId: id,
    description: `Usuário ${updated.name} teve a situação alterada para ${status}.`,
    severity: status === "bloqueado" ? "critico" : "atencao",
  });

  return updated;
}

/**
 * Exclusão de usuário — operação crítica.
 * Exige a Permissão Especial `usuario.excluir`
 * (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md).
 */
export async function deleteUser(id: string): Promise<void> {
  await delay(140);

  const index = store.findIndex((user) => user.id === id);
  if (index < 0) throw new Error("Usuário não encontrado.");

  const [removed] = store.splice(index, 1);
  registerAuditEvent({
    entity: "usuario",
    action: "excluido",
    entityId: id,
    description: `Usuário ${removed?.name ?? id} excluído da plataforma.`,
    severity: "critico",
  });
}

export async function getUsersSummary(): Promise<{
  total: number;
  ativos: number;
  inativos: number;
  bloqueados: number;
}> {
  await delay(100);
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
  await delay(80);
  return store.reduce<Record<string, number>>((acc, user) => {
    const value = user[key];
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}
