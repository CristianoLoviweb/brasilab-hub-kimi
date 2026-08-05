import { eq } from "drizzle-orm";

import type { AccessGroupCode } from "@/features/access/types";
import type { Group } from "@/features/groups/types";
import type { Profile } from "@/features/profiles/types";
import type { User } from "@/features/users/types";

import { getDb, schema } from "../db/client";
import { maxSequence } from "./auditRepository";

const { users, groups, profiles } = schema;

/**
 * Repositórios das entidades administrativas planas (Sprint 03.2):
 * usuários, grupos e perfis — CRUD direto sobre o PostgreSQL.
 */

/* ---------------------------------------------------------------- usuários */

function userToDomain(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    registration: row.registration,
    position: row.position,
    groupCode: row.groupCode as AccessGroupCode,
    profileId: row.profileId,
    status: row.status as User["status"],
    createdAt: row.createdAt.toISOString(),
    lastAccessAt: row.lastAccessAt ? row.lastAccessAt.toISOString() : null,
    ...(row.notes != null ? { notes: row.notes } : {}),
    specialPermissions: row.specialPermissions,
  };
}

function userToRow(user: User, passwordHash: string) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash,
    phone: user.phone,
    registration: user.registration,
    position: user.position,
    groupCode: user.groupCode,
    profileId: user.profileId,
    status: user.status,
    notes: user.notes ?? null,
    specialPermissions: user.specialPermissions,
    createdAt: new Date(user.createdAt),
    lastAccessAt: user.lastAccessAt ? new Date(user.lastAccessAt) : null,
  };
}

export async function loadUsers(): Promise<User[]> {
  const rows = await getDb().select().from(users);
  return rows.map(userToDomain);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const [row] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return row ? userToDomain(row) : undefined;
}

export async function getUserPasswordHash(userId: string): Promise<string | null> {
  const [row] = await getDb()
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row?.passwordHash ?? null;
}

export async function insertUser(user: User, passwordHash: string): Promise<void> {
  await getDb().insert(users).values(userToRow(user, passwordHash));
}

export async function updateUserRow(user: User, passwordHash?: string): Promise<void> {
  const existing = passwordHash ?? (await getUserPasswordHash(user.id));
  if (!existing) throw new Error("Usuário não encontrado.");
  await getDb().update(users).set(userToRow(user, existing)).where(eq(users.id, user.id));
}

export async function deleteUserRow(id: string): Promise<void> {
  await getDb().delete(users).where(eq(users.id, id));
}

export async function touchUserAccess(id: string, when: Date): Promise<void> {
  await getDb().update(users).set({ lastAccessAt: when }).where(eq(users.id, id));
}

export async function nextUserSequence(): Promise<number> {
  const rows = await getDb().select({ id: users.id }).from(users);
  return maxSequence(
    rows.map((row) => row.id),
    "USR-",
  );
}

/* ----------------------------------------------------------------- grupos */

function groupToDomain(row: typeof groups.$inferSelect): Group {
  return {
    code: row.code as AccessGroupCode,
    name: row.name,
    description: row.description,
    manager: row.manager,
    email: row.email,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
    modules: row.modules,
    permissions: row.permissions,
  };
}

export async function loadGroups(): Promise<Group[]> {
  const rows = await getDb().select().from(groups);
  return rows.map(groupToDomain);
}

export async function insertGroup(group: Group): Promise<void> {
  await getDb()
    .insert(groups)
    .values({
      code: group.code,
      name: group.name,
      description: group.description,
      manager: group.manager,
      email: group.email,
      active: group.active,
      modules: group.modules,
      permissions: group.permissions,
      createdAt: new Date(group.createdAt),
    });
}

export async function updateGroupRow(group: Group): Promise<void> {
  await getDb()
    .update(groups)
    .set({
      name: group.name,
      description: group.description,
      manager: group.manager,
      email: group.email,
      active: group.active,
      modules: group.modules,
      permissions: group.permissions,
    })
    .where(eq(groups.code, group.code));
}

export async function deleteGroupRow(code: string): Promise<void> {
  await getDb().delete(groups).where(eq(groups.code, code));
}

/* ----------------------------------------------------------------- perfis */

function profileToDomain(row: typeof profiles.$inferSelect): Profile {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    groupCode: row.groupCode as AccessGroupCode,
    level: row.level as Profile["level"],
    active: row.active,
    createdAt: row.createdAt.toISOString(),
    override: row.override,
    specialPermissions: row.specialPermissions,
  };
}

export async function loadProfiles(): Promise<Profile[]> {
  const rows = await getDb().select().from(profiles);
  return rows.map(profileToDomain);
}

export async function insertProfile(profile: Profile): Promise<void> {
  await getDb()
    .insert(profiles)
    .values({
      id: profile.id,
      name: profile.name,
      description: profile.description,
      groupCode: profile.groupCode,
      level: profile.level,
      active: profile.active,
      override: profile.override,
      specialPermissions: profile.specialPermissions,
      createdAt: new Date(profile.createdAt),
    });
}

export async function updateProfileRow(profile: Profile): Promise<void> {
  await getDb()
    .update(profiles)
    .set({
      name: profile.name,
      description: profile.description,
      groupCode: profile.groupCode,
      level: profile.level,
      active: profile.active,
      override: profile.override,
      specialPermissions: profile.specialPermissions,
    })
    .where(eq(profiles.id, profile.id));
}

export async function deleteProfileRow(id: string): Promise<void> {
  await getDb().delete(profiles).where(eq(profiles.id, id));
}

export async function nextProfileSequence(): Promise<number> {
  const rows = await getDb().select({ id: profiles.id }).from(profiles);
  return maxSequence(
    rows.map((row) => row.id),
    "PRF-",
  );
}
