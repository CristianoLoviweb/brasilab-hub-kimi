import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { AuditFilters } from "@/features/audit/services/auditService";
import type { GroupFilters } from "@/features/groups/services/groupService";
import type { ProfileFilters } from "@/features/profiles/services/profileService";
import type { UserFilters } from "@/features/users/services/userService";

import { assertModuleAccess } from "../auth/actor";
import * as auditService from "../services/auditService.server";
import * as dashboardService from "../services/dashboardService.server";
import * as groupService from "../services/groupService.server";
import * as profileService from "../services/profileService.server";
import * as userService from "../services/userService.server";
import { requireUser } from "./context";

/**
 * Server Functions administrativas (Sprint 03.2): usuários, grupos, perfis,
 * auditoria e widgets do Dashboard.
 *
 * O acesso ao módulo Administração é conferido no servidor com os dados do
 * banco (mesma regra que a interface aplica). O ator registrado na
 * Auditoria é sempre o usuário da sessão.
 */

const ADMIN_MODULE = "administracao";

async function requireAdminActor() {
  const user = await requireUser();
  await assertModuleAccess(user, ADMIN_MODULE);
  return { actorId: user.id, actorName: user.name, actorGroup: user.groupCode };
}

const pageSchema = z
  .object({
    search: z.string().max(200).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(1000).optional(),
  })
  .passthrough();

/* ---------------------------------------------------------------- usuários */

export const listUsersFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => pageSchema.parse(data ?? {}) as UserFilters)
  .handler(async ({ data }) => {
    await requireAdminActor();
    return userService.listUsers(data);
  });

export const getUserFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    await requireAdminActor();
    return userService.getUser(data);
  });

export const createUserFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as Parameters<typeof userService.createUser>[0])
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return userService.createUser(data, actor);
  });

export const updateUserFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: unknown) => data as { id: string; input: Parameters<typeof userService.updateUser>[1] },
  )
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return userService.updateUser(data.id, data.input, actor);
  });

export const changeUserStatusFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ id: z.string().min(1), status: z.enum(["ativo", "inativo", "bloqueado"]) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return userService.changeUserStatus(data.id, data.status, actor);
  });

export const deleteUserFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return userService.deleteUser(data, actor);
  });

export const getUsersSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminActor();
  return userService.getUsersSummary();
});

export const countUsersByFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.enum(["groupCode", "profileId"]).parse(data))
  .handler(async ({ data }) => {
    await requireAdminActor();
    return userService.countUsersBy(data);
  });

/* ----------------------------------------------------------------- grupos */

export const listGroupsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => pageSchema.parse(data ?? {}) as GroupFilters)
  .handler(async ({ data }) => {
    await requireAdminActor();
    return groupService.listGroups(data);
  });

export const listAllGroupsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireUser();
  return groupService.listAllGroups();
});

export const getGroupFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    await requireAdminActor();
    return groupService.getGroup(data);
  });

export const createGroupFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as Parameters<typeof groupService.createGroup>[0])
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return groupService.createGroup(data, actor);
  });

export const updateGroupFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: unknown) =>
      data as { code: string; input: Parameters<typeof groupService.updateGroup>[1] },
  )
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return groupService.updateGroup(data.code, data.input, actor);
  });

export const deleteGroupFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return groupService.deleteGroup(data, actor);
  });

/* ----------------------------------------------------------------- perfis */

export const listProfilesFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => pageSchema.parse(data ?? {}) as ProfileFilters)
  .handler(async ({ data }) => {
    await requireAdminActor();
    return profileService.listProfiles(data);
  });

export const listAllProfilesFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireUser();
  return profileService.listAllProfiles();
});

export const getProfileFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    await requireAdminActor();
    return profileService.getProfile(data);
  });

export const createProfileFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as Parameters<typeof profileService.createProfile>[0])
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return profileService.createProfile(data, actor);
  });

export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: unknown) =>
      data as { id: string; input: Parameters<typeof profileService.updateProfile>[1] },
  )
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return profileService.updateProfile(data.id, data.input, actor);
  });

export const deleteProfileFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    const actor = await requireAdminActor();
    return profileService.deleteProfile(data, actor);
  });

/* -------------------------------------------------------------- auditoria */

export const listAuditEventsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => pageSchema.parse(data ?? {}) as AuditFilters)
  .handler(async ({ data }) => {
    await requireAdminActor();
    return auditService.listAuditEvents(data);
  });

export const listEntityHistoryFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    await requireAdminActor();
    return auditService.listEntityHistory(data);
  });

export const getAuditSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminActor();
  return auditService.getAuditSummary();
});

/* -------------------------------------------------------------- dashboard */

export const resolveWidgetDataFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.string().min(1).parse(data))
  .handler(async ({ data }) => {
    await requireUser();
    return dashboardService.resolveWidgetData(data);
  });
