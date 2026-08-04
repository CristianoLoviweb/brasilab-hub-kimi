import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDateTime } from "@/lib/query";

import { LEAD_EVENT_LABELS, type LeadEventCode } from "../constants/leadEvents";
import type { LeadHistoryEntry } from "../types";

/**
 * Histórico do Lead — cronológico e imutável
 * (docs/regras_de_negocio/05_HISTORICOS.md).
 */
export function LeadHistoryTimeline({ entries }: { entries: LeadHistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="Nenhum evento registrado"
        description="O Histórico será alimentado automaticamente a cada ação relevante."
      />
    );
  }

  const ordered = [...entries].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  return (
    <ol className="relative space-y-5 border-l pl-5">
      {ordered.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1.5 -left-[23px] h-2.5 w-2.5 rounded-full bg-primary" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={LEAD_EVENT_LABELS[item.event as LeadEventCode] ?? item.event}
              tone={item.origin === "sistema" ? "info" : "neutral"}
            />
            <span className="text-xs text-muted-foreground">
              {formatDateTime(item.occurredAt)} · {item.actorName}
            </span>
          </div>
          <p className="mt-1 text-sm">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
