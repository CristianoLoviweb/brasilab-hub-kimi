import { useCallback, useEffect, useState } from "react";

import { DEFAULT_ACCESS_GROUP, getAccessGroup } from "../config/accessGroups";
import type { AccessGroup, AccessGroupCode } from "../types";

const STORAGE_KEY = "brasilab.dev.accessGroup";
const PROFILE_STORAGE_KEY = "brasilab.dev.accessProfile";

function isValidCode(value: string | null): value is AccessGroupCode {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(
    getAccessGroupCatalog(),
    value,
  );
}

function getAccessGroupCatalog(): Record<string, unknown> {
  // import indireto evita ciclo de tipos; catálogo é estático
  return {
    administracao: 1,
    diretoria: 1,
    comercial: 1,
    financeiro: 1,
    producao: 1,
    compras: 1,
    logistica: 1,
    engenharia: 1,
  };
}

/**
 * Grupo de Acesso corrente.
 *
 * ============================================================================
 * DEVELOPMENT ONLY (parte simulada)
 * ----------------------------------------------------------------------------
 * Nesta etapa o Grupo e o Perfil são apenas simulados e podem ser alternados
 * pelo seletor de desenvolvimento (DevGroupSwitcher), com persistência em
 * localStorage.
 *
 * Na implementação definitiva da Autenticação e Permissões, este hook passará
 * a obter Grupo e Perfil automaticamente do usuário autenticado (backend),
 * mantendo exatamente a mesma assinatura pública
 * ({ group, code, profileId, isReady }).
 * As funções `changeGroup` / `changeProfile` e o armazenamento local serão
 * então removidos.
 * ============================================================================
 */

export function useAccessGroup() {
  const [code, setCode] = useState<AccessGroupCode>(DEFAULT_ACCESS_GROUP);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isValidCode(stored)) setCode(stored);

    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) setProfileId(storedProfile);

    setIsReady(true);
  }, []);

  const changeGroup = useCallback((next: AccessGroupCode) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfileId(null);
    setCode(next);
  }, []);

  const changeProfile = useCallback((next: string | null) => {
    if (next) window.localStorage.setItem(PROFILE_STORAGE_KEY, next);
    else window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfileId(next);
  }, []);

  const group: AccessGroup = getAccessGroup(code);

  return { group, code, profileId, changeGroup, changeProfile, isReady };
}
