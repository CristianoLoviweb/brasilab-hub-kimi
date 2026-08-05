import { createHash, randomBytes } from "node:crypto";

import { and, eq, gt, isNull } from "drizzle-orm";

import type { User } from "@/features/users/types";

import { getSessionTtlMs } from "../env";
import { getDb, schema } from "../db/client";
import { findUserByEmail, loadUsers, touchUserAccess } from "../repositories/adminRepositories";

const { sessions } = schema;

/**
 * Sessões reais no servidor (Sprint 03.2).
 *
 * O navegador recebe um token aleatório em cookie HttpOnly; no banco fica
 * SOMENTE o SHA-256 do token (defesa em profundidade: um vazamento do
 * banco não expõe tokens utilizáveis). Sessões expiram e podem ser
 * revogadas no logout.
 */

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export async function createSession(userId: string): Promise<CreatedSession> {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + getSessionTtlMs());

  await getDb()
    .insert(sessions)
    .values({
      id: hashSessionToken(token),
      userId,
      createdAt: now,
      expiresAt,
    });

  await touchUserAccess(userId, now);
  return { token, expiresAt };
}

export interface ResolvedSession {
  user: User;
  createdAt: Date;
  expiresAt: Date;
}

/** Sessão vigente (null quando inexistente, expirada ou revogada). */
export async function resolveSession(token: string | undefined): Promise<ResolvedSession | null> {
  if (!token) return null;

  const [row] = await getDb()
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, hashSessionToken(token)),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!row) return null;

  const users = await loadUsers();
  const user = users.find((item) => item.id === row.userId);
  if (!user) return null;

  return { user, createdAt: row.createdAt, expiresAt: row.expiresAt };
}

/** Revoga a sessão (logout real — o token deixa de valer imediatamente). */
export async function revokeSession(token: string | undefined): Promise<void> {
  if (!token) return;
  await getDb()
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.id, hashSessionToken(token)), isNull(sessions.revokedAt)));
}

export { findUserByEmail };
