import {
  getCurrentSessionFn,
  requestPasswordRecoveryFn,
  signInFn,
  signOutFn,
} from "@/server/fns/authFns";

import type { AccessGroupCode } from "@/features/access/types";

import type { LoginFormValues } from "../schemas/authSchemas";

/**
 * Autenticação da plataforma (Sprint 03.2).
 *
 * Autenticação REAL no servidor: login validado com hash argon2id no
 * PostgreSQL, sessão em cookie HttpOnly com expiração e logout com
 * revogação. Este módulo mantém exatamente o mesmo contrato público da
 * etapa simulada — todo o acesso ao estado de sessão passa por aqui.
 *
 * A chave legada da autenticação simulada ("brasilab.session", em
 * localStorage) é removida INDIVIDUALMENTE, pelo nome, na inicialização —
 * nenhum outro dado do navegador é tocado (condicional nº 4).
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  groupCode: AccessGroupCode;
  profileId: string;
}

export interface AuthSession {
  user: AuthUser;
  issuedAt: number;
  expiresAt: number;
}

/** Chaves nomeadas da autenticação simulada (Sprints anteriores à 03.2). */
const LEGACY_SESSION_KEYS = ["brasilab.session"] as const;

/**
 * Remove individualmente, pelo nome, as chaves da autenticação simulada.
 * Nunca utiliza localStorage.clear() nem varreduras genéricas.
 */
export function clearLegacySimulatedSessionKeys(): void {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_SESSION_KEYS) {
    try {
      if (window.localStorage.getItem(key) !== null) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ambiente sem acesso ao localStorage — nada a fazer.
    }
  }
}

/** Sessão vigente, resolvida no servidor a partir do cookie HttpOnly. */
export async function readSession(): Promise<AuthSession | null> {
  return getCurrentSessionFn();
}

export async function signIn(values: LoginFormValues): Promise<AuthSession> {
  return signInFn({ data: values });
}

export async function signOut(): Promise<void> {
  await signOutFn();
}

export async function requestPasswordRecovery(email: string): Promise<void> {
  await requestPasswordRecoveryFn({ data: { email } });
}
