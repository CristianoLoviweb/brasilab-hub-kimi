import { useAuth } from "@/features/auth/hooks/useAuth";

import { DEFAULT_ACCESS_GROUP, getAccessGroup } from "../config/accessGroups";
import type { AccessGroup, AccessGroupCode } from "../types";

/**
 * Grupo de Acesso corrente.
 *
 * Sprint 03.1: o seletor de desenvolvimento (DevGroupSwitcher) e a
 * persistência em localStorage foram removidos. O Grupo e o Perfil passam a
 * derivar do usuário autenticado, mantendo exatamente a mesma assinatura
 * pública ({ group, code, profileId, isReady }).
 *
 * A autorização exibida aqui é apenas apresentação: a validação definitiva
 * ocorrerá SEMPRE no servidor (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */
export function useAccessGroup() {
  const { user, isReady } = useAuth();

  const code: AccessGroupCode = user?.groupCode ?? DEFAULT_ACCESS_GROUP;
  const group: AccessGroup = getAccessGroup(code);
  const profileId = user?.profileId ?? null;

  return { group, code, profileId, isReady };
}
