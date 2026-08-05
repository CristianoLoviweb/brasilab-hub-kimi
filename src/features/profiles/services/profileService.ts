import type { ListParams, Paginated } from "@/lib/query";
import {
  createProfileFn,
  deleteProfileFn,
  getProfileFn,
  listAllProfilesFn,
  listProfilesFn,
  updateProfileFn,
} from "@/server/fns/adminFns";

import type { Profile, ProfileInput } from "../types";

/**
 * Service de Perfis (Sprint 03.2).
 * Assinaturas homologadas preservadas; as operações executam no servidor
 * com persistência real no PostgreSQL e auditoria do ator da sessão.
 */

export interface ProfileFilters extends ListParams {
  groupCode?: string | "todos";
  active?: "todos" | "ativos" | "inativos";
}

export async function listProfiles(filters: ProfileFilters = {}): Promise<Paginated<Profile>> {
  return listProfilesFn({ data: filters });
}

export async function listAllProfiles(): Promise<Profile[]> {
  return listAllProfilesFn();
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  return getProfileFn({ data: id });
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  return createProfileFn({ data: input });
}

export async function updateProfile(id: string, input: ProfileInput): Promise<Profile> {
  return updateProfileFn({ data: { id, input } });
}

export async function deleteProfile(id: string): Promise<void> {
  await deleteProfileFn({ data: id });
}
