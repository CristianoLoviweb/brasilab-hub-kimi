import { getDb } from "../db/client";
import { auditEvents } from "../db/schema";
import type { AuditEvent } from "@/features/audit/types";

/**
 * Repositório da trilha de auditoria (Sprint 03.2).
 * Somente leitura e inclusão — a imutabilidade é regra de negócio
 * (docs/regras_de_negocio/05_HISTORICOS.md): não existem operações de
 * alteração ou exclusão neste repositório.
 */

function toDomain(row: typeof auditEvents.$inferSelect): AuditEvent {
  return {
    id: row.id,
    code: row.code as AuditEvent["code"],
    entity: row.entity as AuditEvent["entity"],
    action: row.action as AuditEvent["action"],
    entityId: row.entityId,
    description: row.description,
    severity: row.severity as AuditEvent["severity"],
    occurredAt: row.occurredAt.toISOString(),
    actorId: row.actorId,
    actorName: row.actorName,
    actorGroup: row.actorGroup as AuditEvent["actorGroup"],
    origin: row.origin as AuditEvent["origin"],
  };
}

export async function insertAuditEvent(event: AuditEvent): Promise<void> {
  await getDb()
    .insert(auditEvents)
    .values({
      id: event.id,
      code: event.code,
      entity: event.entity,
      action: event.action,
      entityId: event.entityId,
      description: event.description,
      severity: event.severity,
      occurredAt: new Date(event.occurredAt),
      actorId: event.actorId,
      actorName: event.actorName,
      actorGroup: event.actorGroup,
      origin: event.origin,
    });
}

export async function loadAuditEvents(): Promise<AuditEvent[]> {
  const rows = await getDb().select().from(auditEvents);
  return rows.map(toDomain);
}

/** Maior sequência AUD já utilizada (para geração do próximo identificador). */
export async function loadAuditSequence(): Promise<number> {
  const rows = await getDb().select({ id: auditEvents.id }).from(auditEvents);
  return maxSequence(
    rows.map((row) => row.id),
    "AUD-",
  );
}

export function maxSequence(ids: string[], prefix: string): number {
  let max = 0;
  for (const id of ids) {
    if (!id.startsWith(prefix)) continue;
    const value = Number.parseInt(id.slice(prefix.length), 10);
    if (Number.isFinite(value) && value > max) max = value;
  }
  return max;
}
