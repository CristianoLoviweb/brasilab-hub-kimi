import { useMemo } from "react";

import { useAccessGroup } from "@/features/access/hooks/useAccessGroup";

import {
  LEAD_PERMISSION_SETS,
  type LeadPermissionCode,
} from "../constants/leadPermissions";
import { MOCK_MANAGERS, MOCK_SELLERS } from "../data/mockLeads";
import type { CommercialActor } from "../types";

/**
 * DEVELOPMENT ONLY (parte simulada)
 *
 * Ator comercial corrente (vendedor, gestor ou observador).
 *
 * Nesta Sprint a identidade deriva do Grupo e do Perfil simulados
 * (DevGroupSwitcher, Sprint 01/02). Quando a Autenticação real existir, este
 * hook passará a obter o usuário autenticado e suas permissões do backend,
 * mantendo exatamente a mesma assinatura pública ({ actor, can, isManager }).
 *
 * A autorização exibida aqui é apenas apresentação: a validação definitiva
 * ocorrerá SEMPRE no servidor (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */

/** Perfis comerciais com atribuição de gestão (docs — Perfis da Sprint 02). */
const MANAGER_PROFILES = ["PRF-004", "PRF-005"];

const DEFAULT_SELLER = MOCK_SELLERS[2]!; // Patrícia Moraes
const DEFAULT_MANAGER = MOCK_MANAGERS[0]!; // Camila Nogueira

export interface CommercialActorState {
  actor: CommercialActor;
  /** Conjunto simulado de permissões do módulo. */
  permissions: readonly LeadPermissionCode[];
  can: (permission: LeadPermissionCode) => boolean;
  isManager: boolean;
  /** Somente leitura (Diretoria e demais áreas autorizadas). */
  isViewer: boolean;
  isReady: boolean;
}

export function useCommercialActor(): CommercialActorState {
  const { group, profileId, isReady } = useAccessGroup();

  return useMemo(() => {
    const isCommercial = group.code === "comercial";
    const isAdministrative = group.code === "administracao";
    const isManager =
      isAdministrative ||
      (isCommercial && MANAGER_PROFILES.includes(profileId ?? ""));
    const isViewer = !isCommercial && !isAdministrative;

    const identity = isManager ? DEFAULT_MANAGER : DEFAULT_SELLER;

    const actor: CommercialActor = {
      id: identity.id,
      name: identity.name,
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
  }, [group.code, profileId, isReady]);
}
