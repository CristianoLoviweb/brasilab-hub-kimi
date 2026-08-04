import { delay, matchesSearch, paginate } from "@/lib/query";
import type { ListParams, Paginated } from "@/lib/query";

import { MOCK_AUDIT_EVENTS } from "../data/mockAudit";
import type { AuditAction, AuditEntity, AuditEvent, AuditSeverity } from "../types";

/**
 * DEVELOPMENT ONLY (dados simulados)
 *
 * Registro de auditoria em memória. Respeita a regra da imutabilidade
 * (docs/regras_de_negocio/05_HISTORICOS.md): este service oferece apenas
 * leitura e inclusão — nunca alteração ou exclusão.
 */
const store: AuditEvent[] = [...MOCK_AUDIT_EVENTS];

let sequence = store.length;

function nextId(): string {
  sequence += 1;
  return `AUD-${String(sequence).padStart(4, "0")}`;
}

export interface AuditFilters extends ListParams {
  entity?: AuditEntity | "todas";
  severity?: AuditSeverity | "todas";
  entityId?: string;
}

function sortByRecent(events: AuditEvent[]): AuditEvent[] {
  return [...events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

export async function listAuditEvents(
  filters: AuditFilters = {},
): Promise<Paginated<AuditEvent>> {
  await delay();

  const rows = sortByRecent(store)
    .filter((event) =>
      filters.entity && filters.entity !== "todas" ? event.entity === filters.entity : true,
    )
    .filter((event) =>
      filters.severity && filters.severity !== "todas"
        ? event.severity === filters.severity
        : true,
    )
    .filter((event) => (filters.entityId ? event.entityId === filters.entityId : true))
    .filter((event) =>
      matchesSearch(filters.search, event.description, event.actorName, event.code),
    );

  return paginate(rows, filters.page, filters.pageSize);
}

/** Histórico de um registro específico (usuário, grupo ou perfil). */
export async function listEntityHistory(entityId: string): Promise<AuditEvent[]> {
  await delay(120);
  return sortByRecent(store.filter((event) => event.entityId === entityId));
}

export interface AuditInput {
  entity: AuditEntity;
  action: AuditAction;
  entityId: string;
  description: string;
  severity?: AuditSeverity;
  actorId?: string;
  actorName?: string;
  actorGroup?: AuditEvent["actorGroup"];
}

/** Inclusão de evento — a trilha é apenas acrescida, nunca modificada. */
export function registerAuditEvent(input: AuditInput): AuditEvent {
  const event: AuditEvent = {
    id: nextId(),
    code: `${input.entity}.${input.action}`,
    entity: input.entity,
    action: input.action,
    entityId: input.entityId,
    description: input.description,
    severity: input.severity ?? "informativo",
    occurredAt: new Date().toISOString(),
    actorId: input.actorId ?? "USR-0001",
    actorName: input.actorName ?? "Marina Duarte",
    actorGroup: input.actorGroup ?? "administracao",
    origin: "interface",
  };

  store.push(event);
  return event;
}

export async function getAuditSummary(): Promise<{
  total: number;
  criticos: number;
  hoje: number;
  entidades: number;
}> {
  await delay(100);
  const today = new Date().toDateString();

  return {
    total: store.length,
    criticos: store.filter((event) => event.severity === "critico").length,
    hoje: store.filter((event) => new Date(event.occurredAt).toDateString() === today)
      .length,
    entidades: new Set(store.map((event) => event.entity)).size,
  };
}
