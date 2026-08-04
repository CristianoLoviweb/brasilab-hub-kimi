import { delay, matchesSearch, paginate } from "@/lib/query";
import type { ListParams, Paginated } from "@/lib/query";
import { registerAuditEvent } from "@/features/audit/services/auditService";

import { MOCK_PROFILES } from "../data/mockProfiles";
import type { Profile, ProfileInput } from "../types";

/**
 * DEVELOPMENT ONLY (dados simulados)
 * CRUD de Perfis em memória.
 */
const store: Profile[] = [...MOCK_PROFILES];

let sequence = store.length;

function nextId(): string {
  sequence += 1;
  return `PRF-${String(sequence).padStart(3, "0")}`;
}

export interface ProfileFilters extends ListParams {
  groupCode?: string | "todos";
  active?: "todos" | "ativos" | "inativos";
}

export async function listProfiles(
  filters: ProfileFilters = {},
): Promise<Paginated<Profile>> {
  await delay();

  const rows = store
    .filter((profile) =>
      filters.groupCode && filters.groupCode !== "todos"
        ? profile.groupCode === filters.groupCode
        : true,
    )
    .filter((profile) =>
      filters.active && filters.active !== "todos"
        ? profile.active === (filters.active === "ativos")
        : true,
    )
    .filter((profile) => matchesSearch(filters.search, profile.name, profile.description))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return paginate(rows, filters.page, filters.pageSize);
}

export async function listAllProfiles(): Promise<Profile[]> {
  await delay(80);
  return [...store].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  await delay(120);
  return store.find((profile) => profile.id === id);
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  await delay();

  const profile: Profile = {
    ...input,
    id: nextId(),
    createdAt: new Date().toISOString(),
    override: {},
  };

  store.push(profile);
  registerAuditEvent({
    entity: "perfil",
    action: "criado",
    entityId: profile.id,
    description: `Perfil ${profile.name} criado.`,
  });

  return profile;
}

export async function updateProfile(id: string, input: ProfileInput): Promise<Profile> {
  await delay();

  const index = store.findIndex((profile) => profile.id === id);
  if (index < 0) throw new Error("Perfil não encontrado.");

  const previous = store[index];
  if (!previous) throw new Error("Perfil não encontrado.");

  const updated: Profile = { ...previous, ...input };
  store[index] = updated;

  const specialChanged =
    previous.specialPermissions.join(",") !== updated.specialPermissions.join(",");

  registerAuditEvent({
    entity: specialChanged ? "permissao" : "perfil",
    action: specialChanged ? "permissao_alterada" : "atualizado",
    entityId: id,
    description: specialChanged
      ? `Permissões especiais do perfil ${updated.name} alteradas.`
      : `Perfil ${updated.name} atualizado.`,
    severity: specialChanged ? "critico" : "atencao",
  });

  return updated;
}

export async function deleteProfile(id: string): Promise<void> {
  await delay(140);

  const index = store.findIndex((profile) => profile.id === id);
  if (index < 0) throw new Error("Perfil não encontrado.");

  const [removed] = store.splice(index, 1);
  registerAuditEvent({
    entity: "perfil",
    action: "excluido",
    entityId: id,
    description: `Perfil ${removed?.name ?? id} excluído.`,
    severity: "critico",
  });
}
