import { matchesSearch, paginate } from "@/lib/query";
import type { AccessGroupCode } from "@/features/access/types";
import type { Group, GroupInput } from "@/features/groups/types";

import {
  deleteGroupRow,
  insertGroup,
  loadGroups,
  updateGroupRow,
} from "../repositories/adminRepositories";
import { registerAuditEvent, type AuditInput } from "./auditService.server";

/**
 * Service de Grupos no servidor (Sprint 03.2).
 * Mesma lógica homologada — agora com persistência real no PostgreSQL.
 */

export interface GroupFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  active?: "todos" | "ativos" | "inativos";
}

type AuditActor = Pick<AuditInput, "actorId" | "actorName" | "actorGroup">;

export async function listGroups(filters: GroupFilters = {}) {
  const store = await loadGroups();

  const rows = store
    .filter((group) =>
      filters.active && filters.active !== "todos"
        ? group.active === (filters.active === "ativos")
        : true,
    )
    .filter((group) => matchesSearch(filters.search, group.name, group.description, group.manager))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return paginate(rows, filters.page, filters.pageSize);
}

export async function listAllGroups(): Promise<Group[]> {
  const store = await loadGroups();
  return [...store].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getGroup(code: string): Promise<Group | undefined> {
  const store = await loadGroups();
  return store.find((group) => group.code === code);
}

export async function createGroup(input: GroupInput, actor: AuditActor): Promise<Group> {
  const store = await loadGroups();
  if (store.some((group) => group.code === input.code)) {
    throw new Error("Já existe um grupo com este código.");
  }

  const group: Group = {
    ...input,
    createdAt: new Date().toISOString(),
    permissions: Object.fromEntries(input.modules.map((slug) => [slug, { visualizar: true }])),
  };

  await insertGroup(group);

  await registerAuditEvent({
    entity: "grupo",
    action: "criado",
    entityId: group.code,
    description: `Grupo ${group.name} criado.`,
    ...actor,
  });

  return group;
}

export async function updateGroup(
  code: string,
  input: GroupInput,
  actor: AuditActor,
): Promise<Group> {
  const store = await loadGroups();
  const previous = store.find((group) => group.code === code);
  if (!previous) throw new Error("Grupo não encontrado.");

  const permissions = Object.fromEntries(
    input.modules.map((slug) => [slug, previous.permissions[slug] ?? { visualizar: true }]),
  );

  const updated: Group = {
    ...previous,
    ...input,
    code: code as AccessGroupCode,
    permissions,
  };
  await updateGroupRow(updated);

  await registerAuditEvent({
    entity: "grupo",
    action: "atualizado",
    entityId: code,
    description: `Grupo ${updated.name} atualizado.`,
    severity: "atencao",
    ...actor,
  });

  return updated;
}

export async function deleteGroup(code: string, actor: AuditActor): Promise<void> {
  const store = await loadGroups();
  const removed = store.find((group) => group.code === code);
  if (!removed) throw new Error("Grupo não encontrado.");

  await deleteGroupRow(code);

  await registerAuditEvent({
    entity: "grupo",
    action: "excluido",
    entityId: code,
    description: `Grupo ${removed.name} excluído.`,
    severity: "critico",
    ...actor,
  });
}
