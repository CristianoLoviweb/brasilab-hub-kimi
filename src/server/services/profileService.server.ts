import { matchesSearch, paginate } from "@/lib/query";
import type { Profile, ProfileInput } from "@/features/profiles/types";

import {
  deleteProfileRow,
  insertProfile,
  loadProfiles,
  nextProfileSequence,
  updateProfileRow,
} from "../repositories/adminRepositories";
import { registerAuditEvent, type AuditInput } from "./auditService.server";

/**
 * Service de Perfis no servidor (Sprint 03.2).
 * Mesma lógica homologada — agora com persistência real no PostgreSQL.
 */

export interface ProfileFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  groupCode?: string | "todos";
  active?: "todos" | "ativos" | "inativos";
}

type AuditActor = Pick<AuditInput, "actorId" | "actorName" | "actorGroup">;

export async function listProfiles(filters: ProfileFilters = {}) {
  const store = await loadProfiles();

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
  const store = await loadProfiles();
  return [...store].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const store = await loadProfiles();
  return store.find((profile) => profile.id === id);
}

export async function createProfile(input: ProfileInput, actor: AuditActor): Promise<Profile> {
  const sequence = await nextProfileSequence();
  const profile: Profile = {
    ...input,
    id: `PRF-${String(sequence + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    override: {},
  };

  await insertProfile(profile);

  await registerAuditEvent({
    entity: "perfil",
    action: "criado",
    entityId: profile.id,
    description: `Perfil ${profile.name} criado.`,
    ...actor,
  });

  return profile;
}

export async function updateProfile(
  id: string,
  input: ProfileInput,
  actor: AuditActor,
): Promise<Profile> {
  const store = await loadProfiles();
  const previous = store.find((profile) => profile.id === id);
  if (!previous) throw new Error("Perfil não encontrado.");

  const updated: Profile = { ...previous, ...input };
  await updateProfileRow(updated);

  const specialChanged =
    previous.specialPermissions.join(",") !== updated.specialPermissions.join(",");

  await registerAuditEvent({
    entity: specialChanged ? "permissao" : "perfil",
    action: specialChanged ? "permissao_alterada" : "atualizado",
    entityId: id,
    description: specialChanged
      ? `Permissões especiais do perfil ${updated.name} alteradas.`
      : `Perfil ${updated.name} atualizado.`,
    severity: specialChanged ? "critico" : "atencao",
    ...actor,
  });

  return updated;
}

export async function deleteProfile(id: string, actor: AuditActor): Promise<void> {
  const store = await loadProfiles();
  const removed = store.find((profile) => profile.id === id);
  if (!removed) throw new Error("Perfil não encontrado.");

  await deleteProfileRow(id);

  await registerAuditEvent({
    entity: "perfil",
    action: "excluido",
    entityId: id,
    description: `Perfil ${removed.name} excluído.`,
    severity: "critico",
    ...actor,
  });
}
