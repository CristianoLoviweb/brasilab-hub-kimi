import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { loginSchema, passwordRecoverySchema } from "@/features/auth/schemas/authSchemas";
import type { AuthSession, AuthUser } from "@/features/auth/services/authService";
import { MASTER_USER } from "@/features/users/data/masterUser";
import type { User } from "@/features/users/types";

import { verifyPassword } from "../auth/password";
import { createSession, resolveSession, revokeSession } from "../auth/sessionService";
import { loadProfiles } from "../repositories/adminRepositories";
import { findUserByEmail, getUserPasswordHash } from "../repositories/adminRepositories";
import { registerAuditEvent } from "../services/auditService.server";
import { clearSessionCookie, readSessionToken, writeSessionCookie } from "./context";

/**
 * Server Functions de autenticação (Sprint 03.2) — login real com hash
 * argon2id, sessão em cookie HttpOnly e logout com revogação no servidor.
 */

/** Papel exibido no cabeçalho — preserva a apresentação homologada. */
async function roleOf(user: User): Promise<string> {
  if (user.id === MASTER_USER.id) return "Administrador Master";
  const profiles = await loadProfiles();
  return profiles.find((profile) => profile.id === user.profileId)?.name ?? "Usuário";
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

async function toAuthSession(user: User, issuedAt: Date, expiresAt: Date): Promise<AuthSession> {
  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: await roleOf(user),
    initials: initialsOf(user.name),
    groupCode: user.groupCode,
    profileId: user.profileId,
  };
  return { user: authUser, issuedAt: issuedAt.getTime(), expiresAt: expiresAt.getTime() };
}

/* ------------------------------------------- limite de tentativas de login */

const LOGIN_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function assertLoginAllowed(key: string): void {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) return;
  if (entry.count >= LOGIN_MAX_ATTEMPTS) {
    throw new Error("Muitas tentativas de login. Aguarde alguns minutos e tente novamente.");
  }
}

function registerFailedAttempt(key: string): void {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) {
    attempts.set(key, { count: 1, resetAt: Date.now() + LOGIN_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

/* ------------------------------------------------------------------- login */

export const signInFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }): Promise<AuthSession> => {
    const email = data.email.trim().toLowerCase();
    const ip = getRequestIP({ xForwardedFor: true }) ?? "desconhecido";
    const rateKey = `${email}|${ip}`;

    assertLoginAllowed(rateKey);

    const user = await findUserByEmail(email);
    const passwordHash = user ? await getUserPasswordHash(user.id) : null;
    const valid = passwordHash ? await verifyPassword(passwordHash, data.password) : false;

    if (!user || !valid || user.status !== "ativo") {
      registerFailedAttempt(rateKey);
      throw new Error("Credenciais inválidas.");
    }

    attempts.delete(rateKey);

    const { token, expiresAt } = await createSession(user.id);
    writeSessionCookie(token, expiresAt);

    await registerAuditEvent({
      entity: "sessao",
      action: "login",
      entityId: user.id,
      description: `${user.name} autenticou-se na plataforma.`,
      actorId: user.id,
      actorName: user.name,
      actorGroup: user.groupCode,
    });

    return toAuthSession(user, new Date(), expiresAt);
  });

/** Sessão vigente — usada pelo AuthProvider na inicialização do cliente. */
export const getCurrentSessionFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthSession | null> => {
    const session = await resolveSession(readSessionToken());
    if (!session || session.user.status !== "ativo") return null;
    return toAuthSession(session.user, session.createdAt, session.expiresAt);
  },
);

export const signOutFn = createServerFn({ method: "POST" }).handler(async (): Promise<null> => {
  const token = readSessionToken();
  const session = await resolveSession(token);

  await revokeSession(token);
  clearSessionCookie();

  if (session) {
    await registerAuditEvent({
      entity: "sessao",
      action: "logout",
      entityId: session.user.id,
      description: `${session.user.name} encerrou a sessão.`,
      actorId: session.user.id,
      actorName: session.user.name,
      actorGroup: session.user.groupCode,
    });
  }

  return null;
});

/** Estrutura preparada — o envio de e-mail será implementado futuramente. */
export const requestPasswordRecoveryFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => passwordRecoverySchema.parse(data))
  .handler(async (): Promise<null> => null);
