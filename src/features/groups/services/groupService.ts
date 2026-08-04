import { delay, matchesSearch, paginate } from "@/lib/query";
import type { ListParams, Paginated } from "@/lib/query";
import type { AccessGroupCode } from "@/features/access/types";
import { registerAuditEvent } from "@/features/audit/services/auditService";

import { MOCK_GROUPS } from "../data/mockGroups";
import type { Group, GroupInput } from "../types";

/**
 * DEVELOPMENT ONLY (dados simulados)
 * CRUD de Grupos em memória.
 */
const store: Group[] = [...MOCK_GROUPS];

export interface GroupFilters extends ListParams {
  active?: "todos" | "ativos" | "inativos";
}

export async function listGroups(filters: GroupFilters = {}): Promise<Paginated<Group>> {
  await delay();

  const rows = store
    .filter((group) =>
      filters.active && filters.active !== "todos"
        ? group.active === (filters.active === "ativos")
        : true,
    )
    .filter((group) =>
      matchesSearch(filters.search, group.name, group.description, group.manager),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return paginate(rows, filters.page, filters.pageSize);
}

export async function listAllGroups(): Promise<Group[]> {
  await delay(80);
  return [...store].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getGroup(code: string): Promise<Group | undefined> {
  await delay(120);
  return store.find((group) => group.code === code);
}

export async function createGroup(input: GroupInput): Promise<Group> {
  await delay();

  if (store.some((group) => group.code === input.code)) {
    throw new Error("Já existe um grupo com este código.");
  }

  const group: Group = {
    ...input,
    createdAt: new Date().toISOString(),
    permissions: Object.fromEntries(
      input.modules.map((slug) => [slug, { visualizar: true }]),
    ),
  };

  store.push(group);
  registerAuditEvent({
    entity: "grupo",
    action: "criado",
    entityId: group.code,
    description: `Grupo ${group.name} criado.`,
  });

  return group;
}

export async function updateGroup(code: string, input: GroupInput): Promise<Group> {
  await delay();

  const index = store.findIndex((group) => group.code === code);
  if (index < 0) throw new Error("Grupo não encontrado.");

  const previous = store[index];
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
  store[index] = updated;

  registerAuditEvent({
    entity: "grupo",
    action: "atualizado",
    entityId: code,
    description: `Grupo ${updated.name} atualizado.`,
    severity: "atencao",
  });

  return updated;
}

export async function deleteGroup(code: string): Promise<void> {
  await delay(140);

  const index = store.findIndex((group) => group.code === code);
  if (index < 0) throw new Error("Grupo não encontrado.");

  const [removed] = store.splice(index, 1);
  registerAuditEvent({
    entity: "grupo",
    action: "excluido",
    entityId: code,
    description: `Grupo ${removed?.name ?? code} excluído.`,
    severity: "critico",
  });
}
