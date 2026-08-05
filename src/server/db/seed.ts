import { hash } from "@node-rs/argon2";
import { sql } from "drizzle-orm";

import { SEED_GROUPS } from "@/features/groups/data/seedGroups";
import { SEED_PROFILES } from "@/features/profiles/data/seedProfiles";
import { MASTER_USER } from "@/features/users/data/masterUser";

import { getDb } from "./client";
import { groups, profiles, users } from "./schema";

/**
 * Seed estrutural da plataforma (Sprint 03.2 — condicional nº 6).
 *
 * Insere o cadastro inicial — Grupos estruturais, Perfis estruturais
 * (incluindo o Perfil Master) e o usuário Administrador Master — com
 * `ON CONFLICT DO NOTHING`: executar o seed quantas vezes for necessário
 * NUNCA duplica nem sobrescreve dados reais já existentes.
 *
 * Os dados de origem são as constantes canônicas da aplicação
 * (seedGroups, seedProfiles e masterUser) — nenhuma regra é duplicada aqui.
 *
 * Executado automaticamente na inicialização do servidor (src/server.ts) e,
 * manualmente, por `npm run db:seed`.
 */

/**
 * Senha inicial do Administrador Master (mesma credencial homologada desde
 * a Sprint 03.1). Somente o hash argon2id é persistido; a senha inicial
 * deve ser alterada pelo administrador após o primeiro acesso.
 */
const MASTER_INITIAL_PASSWORD = "862466";

const ARGON2_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 };

export async function ensureSeed(): Promise<{ inserted: boolean }> {
  const db = getDb();

  const [existingMaster] = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`${users.id} = ${MASTER_USER.id}`)
    .limit(1);

  if (existingMaster) {
    // Base já semeada — nenhuma reexecução altera dados existentes.
    return { inserted: false };
  }

  const passwordHash = await hash(MASTER_INITIAL_PASSWORD, ARGON2_OPTIONS);

  await db.transaction(async (tx) => {
    for (const group of SEED_GROUPS) {
      await tx
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
        })
        .onConflictDoNothing({ target: groups.code });
    }

    for (const profile of SEED_PROFILES) {
      await tx
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
        })
        .onConflictDoNothing({ target: profiles.id });
    }

    await tx
      .insert(users)
      .values({
        id: MASTER_USER.id,
        name: MASTER_USER.name,
        email: MASTER_USER.email,
        passwordHash,
        phone: MASTER_USER.phone,
        registration: MASTER_USER.registration,
        position: MASTER_USER.position,
        groupCode: MASTER_USER.groupCode,
        profileId: MASTER_USER.profileId,
        status: MASTER_USER.status,
        notes: MASTER_USER.notes ?? null,
        specialPermissions: MASTER_USER.specialPermissions,
        createdAt: new Date(MASTER_USER.createdAt),
        lastAccessAt: null,
      })
      .onConflictDoNothing({ target: users.id });
  });

  console.log("[seed] Cadastro inicial inserido (grupos, perfis e Administrador Master).");
  return { inserted: true };
}
