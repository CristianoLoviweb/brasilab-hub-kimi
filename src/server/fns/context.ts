import { getCookie, setCookie } from "@tanstack/react-start/server";

import type { User } from "@/features/users/types";

import { isCookieSecure } from "../env";
import { resolveSession } from "../auth/sessionService";

/**
 * Contexto de autenticação das Server Functions (Sprint 03.2).
 *
 * Toda função protegida resolve o usuário A PARTIR DA SESSÃO (cookie
 * HttpOnly) — nunca a partir de dados enviados pelo cliente.
 */

export const SESSION_COOKIE = "brasilab_session";

export function readSessionToken(): string | undefined {
  return getCookie(SESSION_COOKIE);
}

export function writeSessionCookie(token: string, expiresAt: Date): void {
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isCookieSecure(),
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(): void {
  setCookie(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isCookieSecure(),
    path: "/",
    maxAge: 0,
  });
}

/** Usuário autenticado obrigatório — lança erro quando a sessão não é válida. */
export async function requireUser(): Promise<User> {
  const session = await resolveSession(readSessionToken());
  if (!session) {
    throw new Error("Sessão inválida ou expirada. Faça login novamente.");
  }
  if (session.user.status !== "ativo") {
    throw new Error("Usuário inativo ou bloqueado.");
  }
  return session.user;
}
