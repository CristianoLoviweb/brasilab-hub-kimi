import type { ListParams, Paginated } from "@/lib/query";
import { getAuditSummaryFn, listAuditEventsFn, listEntityHistoryFn } from "@/server/fns/adminFns";

import type { AuditEntity, AuditEvent, AuditSeverity } from "../types";

/**
 * Service de Auditoria (Sprint 03.2).
 *
 * A trilha respeita a regra da imutabilidade
 * (docs/regras_de_negocio/05_HISTORICOS.md): este service oferece apenas
 * leitura — a inclusão de eventos acontece exclusivamente no servidor,
 * junto a cada operação realizada.
 */

export interface AuditFilters extends ListParams {
  entity?: AuditEntity | "todas";
  severity?: AuditSeverity | "todas";
  entityId?: string;
}

export async function listAuditEvents(filters: AuditFilters = {}): Promise<Paginated<AuditEvent>> {
  return listAuditEventsFn({ data: filters });
}

/** Histórico de um registro específico (usuário, grupo ou perfil). */
export async function listEntityHistory(entityId: string): Promise<AuditEvent[]> {
  return listEntityHistoryFn({ data: entityId });
}

export async function getAuditSummary(): Promise<{
  total: number;
  criticos: number;
  hoje: number;
  entidades: number;
}> {
  return getAuditSummaryFn();
}
