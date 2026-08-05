import {
  LEAD_PERMISSION_SETS,
  type LeadPermissionCode,
} from "@/features/leads/constants/leadPermissions";
import type { CommercialActor } from "@/features/leads/types";
import type { User } from "@/features/users/types";

import { loadGroups } from "../repositories/adminRepositories";

/**
 * Derivação do ator e da autorização NO SERVIDOR (Sprint 03.2).
 *
 * Replica exatamente a regra que a interface já aplica
 * (src/features/leads/hooks/useCommercialActor.ts): a identidade e as
 * permissões passam a derivar da sessão autenticada — o ator informado
 * pelo cliente é ignorado nas operações protegidas.
 */

/** Perfis comerciais com atribuição de gestão (mesma regra da interface). */
const MANAGER_PROFILES = ["PRF-004", "PRF-005"];

export function buildCommercialActor(user: User): CommercialActor {
  const isCommercial = user.groupCode === "comercial";
  const isAdministrative = user.groupCode === "administracao";

  return {
    id: user.id,
    name: user.name,
    groupCode: user.groupCode,
    profileId: user.profileId,
    isManager: isAdministrative || (isCommercial && MANAGER_PROFILES.includes(user.profileId)),
  };
}

export function leadPermissionsFor(actor: CommercialActor): readonly LeadPermissionCode[] {
  const isCommercial = actor.groupCode === "comercial";
  const isAdministrative = actor.groupCode === "administracao";
  const isViewer = !isCommercial && !isAdministrative;

  return isViewer
    ? LEAD_PERMISSION_SETS.viewer
    : actor.isManager
      ? LEAD_PERMISSION_SETS.manager
      : LEAD_PERMISSION_SETS.seller;
}

/** Bloqueia a operação quando o ator não possui a permissão exigida. */
export function assertLeadPermission(actor: CommercialActor, permission: LeadPermissionCode): void {
  if (!leadPermissionsFor(actor).includes(permission)) {
    throw new Error("Você não possui permissão para esta operação.");
  }
}

/**
 * Módulos administrativos exigem Grupo com o módulo liberado — mesma regra
 * que a interface aplica, agora validada no servidor com os dados do banco.
 */
export async function assertModuleAccess(user: User, module: string): Promise<void> {
  const groups = await loadGroups();
  const group = groups.find((item) => item.code === user.groupCode);
  if (!group || !group.modules.includes(module)) {
    throw new Error("Você não possui acesso a este módulo.");
  }
}
