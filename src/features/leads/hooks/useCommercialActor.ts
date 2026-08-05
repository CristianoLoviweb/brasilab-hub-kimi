import { useMemo } from "react";

import { useAccessGroup } from "@/features/access/hooks/useAccessGroup";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { MASTER_USER } from "@/features/users/data/masterUser";

import {
  LEAD_PERMISSION_SETS,
  type LeadPermissionCode,
} from "../constants/leadPermissions";
import type { CommercialActor } from "../types";

/**
 * Ator comercial corrente (vendedor, gestor ou observador).
 *
 * Sprint 03.1: a identidade deriva do usuário autenticado. O único usuário
 * da plataforma (Administrador Master) pertence ao Grupo Administração e
 * possui atribuição de gestão comercial.
 *
 * A autorização exibida aqui é apenas apresentação: a validação definitiva
 * ocorrerá SEMPRE no servidor (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */

/** Perfis comerciais com atribuição de gestão (docs — Perfis da Sprint 02). */
const MANAGER_PROFILES = ["PRF-004", "PRF-005"];

export interface CommercialActorState {
  actor: CommercialActor;
  /** Conjunto de permissões do módulo. */
  permissions: readonly LeadPermissionCode[];
  can: (permission: LeadPermissionCode) => boolean;
  isManager: boolean;
  /** Somente leitura (Diretoria e demais áreas autorizadas). */
  isViewer: boolean;
  isReady: boolean;
}

export function useCommercialActor(): CommercialActorState {
  const { group, profileId, isReady } = useAccessGroup();
  const { user } = useAuth();

  return useMemo(() => {
    const isCommercial = group.code === "comercial";
    const isAdministrative = group.code === "administracao";
    const isManager =
      isAdministrative ||
      (isCommercial && MANAGER_PROFILES.includes(profileId ?? ""));
    const isViewer = !isCommercial && !isAdministrative;

    const actor: CommercialActor = {
      id: user?.id ?? MASTER_USER.id,
      name: user?.name ?? MASTER_USER.name,
      groupCode: group.code,
      profileId: profileId ?? "",
      isManager,
    };

    const permissions = isViewer
      ? LEAD_PERMISSION_SETS.viewer
      : isManager
        ? LEAD_PERMISSION_SETS.manager
        : LEAD_PERMISSION_SETS.seller;

    return {
      actor,
      permissions,
      can: (permission: LeadPermissionCode) => permissions.includes(permission),
      isManager,
      isViewer,
      isReady,
    };
  }, [group.code, profileId, isReady, user?.id, user?.name]);
}
