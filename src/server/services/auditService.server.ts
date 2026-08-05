import { matchesSearch, paginate } from "@/lib/query";
import { MASTER_USER } from "@/features/users/data/masterUser";
import type { AuditEvent } from "@/features/audit/types";

import {
  insertAuditEvent,
  loadAuditEvents,
  loadAuditSequence,
} from "../repositories/auditRepository";

/**
 * Service de Auditoria no servidor (Sprint 03.2).
 *
 * Mesma lógica da versão anterior — a trilha é apenas acrescida, nunca
 * alterada ou excluída — agora persistida no PostgreSQL. As listagens e os
 * resumos mantêm exatamente os mesmos filtros e ordenações.
 */

export interface AuditInput {
  entity: AuditEvent["entity"];
  action: AuditEvent["action"];
  entityId: string;
  description: string;
  severity?: AuditEvent["severity"];
  actorId?: string;
  actorName?: string;
  actorGroup?: AuditEvent["actorGroup"];
}

export interface AuditFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  entity?: AuditEvent["entity"] | "todas";
  severity?: AuditEvent["severity"] | "todas";
  entityId?: string;
}

function sortByRecent(events: AuditEvent[]): AuditEvent[] {
  return [...events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

/** Inclusão de evento — a trilha é apenas acrescida, nunca modificada. */
export async function registerAuditEvent(input: AuditInput): Promise<AuditEvent> {
  const sequence = await loadAuditSequence();
  const event: AuditEvent = {
    id: `AUD-${String(sequence + 1).padStart(4, "0")}`,
    code: `${input.entity}.${input.action}`,
    entity: input.entity,
    action: input.action,
    entityId: input.entityId,
    description: input.description,
    severity: input.severity ?? "informativo",
    occurredAt: new Date().toISOString(),
    actorId: input.actorId ?? MASTER_USER.id,
    actorName: input.actorName ?? MASTER_USER.name,
    actorGroup: input.actorGroup ?? MASTER_USER.groupCode,
    origin: "interface",
  };

  await insertAuditEvent(event);
  return event;
}

export async function listAuditEvents(filters: AuditFilters = {}) {
  const store = await loadAuditEvents();

  const rows = sortByRecent(store)
    .filter((event) =>
      filters.entity && filters.entity !== "todas" ? event.entity === filters.entity : true,
    )
    .filter((event) =>
      filters.severity && filters.severity !== "todas" ? event.severity === filters.severity : true,
    )
    .filter((event) => (filters.entityId ? event.entityId === filters.entityId : true))
    .filter((event) =>
      matchesSearch(filters.search, event.description, event.actorName, event.code),
    );

  return paginate(rows, filters.page, filters.pageSize);
}

/** Histórico de um registro específico (usuário, grupo, perfil ou Lead). */
export async function listEntityHistory(entityId: string): Promise<AuditEvent[]> {
  const store = await loadAuditEvents();
  return sortByRecent(store.filter((event) => event.entityId === entityId));
}

export async function getAuditSummary(): Promise<{
  total: number;
  criticos: number;
  hoje: number;
  entidades: number;
}> {
  const store = await loadAuditEvents();
  const today = new Date().toDateString();

  return {
    total: store.length,
    criticos: store.filter((event) => event.severity === "critico").length,
    hoje: store.filter((event) => new Date(event.occurredAt).toDateString() === today).length,
    entidades: new Set(store.map((event) => event.entity)).size,
  };
}
