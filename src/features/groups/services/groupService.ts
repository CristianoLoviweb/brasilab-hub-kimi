import type { ListParams, Paginated } from "@/lib/query";
import {
  createGroupFn,
  deleteGroupFn,
  getGroupFn,
  listAllGroupsFn,
  listGroupsFn,
  updateGroupFn,
} from "@/server/fns/adminFns";

import type { Group, GroupInput } from "../types";

/**
 * Service de Grupos (Sprint 03.2).
 * Assinaturas homologadas preservadas; as operações executam no servidor
 * com persistência real no PostgreSQL e auditoria do ator da sessão.
 */

export interface GroupFilters extends ListParams {
  active?: "todos" | "ativos" | "inativos";
}

export async function listGroups(filters: GroupFilters = {}): Promise<Paginated<Group>> {
  return listGroupsFn({ data: filters });
}

export async function listAllGroups(): Promise<Group[]> {
  return listAllGroupsFn();
}

export async function getGroup(code: string): Promise<Group | undefined> {
  return getGroupFn({ data: code });
}

export async function createGroup(input: GroupInput): Promise<Group> {
  return createGroupFn({ data: input });
}

export async function updateGroup(code: string, input: GroupInput): Promise<Group> {
  return updateGroupFn({ data: { code, input } });
}

export async function deleteGroup(code: string): Promise<void> {
  await deleteGroupFn({ data: code });
}
