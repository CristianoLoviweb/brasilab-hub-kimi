import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { StatusTone } from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/query";

import { AUDIT_ACTION_LABELS, AUDIT_ENTITY_LABELS } from "../types";
import type { AuditEvent, AuditSeverity } from "../types";

const SEVERITY_TONE: Record<AuditSeverity, StatusTone> = {
  informativo: "info",
  atencao: "warning",
  critico: "danger",
};

const SEVERITY_LABEL: Record<AuditSeverity, string> = {
  informativo: "Informativo",
  atencao: "Atenção",
  critico: "Crítico",
};

/**
 * Linha do tempo da Auditoria.
 * Registros imutáveis (docs/regras_de_negocio/05_HISTORICOS.md) — a interface
 * nunca oferece edição ou exclusão.
 */
export function AuditTimeline({ events }: { events: AuditEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Nenhum evento registrado"
        description="Ainda não existem eventos de auditoria para este filtro."
      />
    );
  }

  return (
    <ol className="relative space-y-4 border-l pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            className="absolute top-1.5 -left-[27px] h-2.5 w-2.5 rounded-full bg-primary"
            aria-hidden
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={SEVERITY_LABEL[event.severity]}
              tone={SEVERITY_TONE[event.severity]}
            />
            <span className="text-sm font-medium">
              {AUDIT_ENTITY_LABELS[event.entity]} · {AUDIT_ACTION_LABELS[event.action]}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(event.occurredAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Registro {event.entityId} · por {event.actorName} · origem {event.origin}
          </p>
        </li>
      ))}
    </ol>
  );
}
