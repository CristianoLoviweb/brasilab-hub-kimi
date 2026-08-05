import { Clock } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { AgendaItem } from "@/features/dashboard/data/widgetData";

interface AgendaCardProps {
  items: AgendaItem[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Agenda. */
export function AgendaCard({
  items,
  title = "Agenda do dia",
  description = "Compromissos de hoje",
}: AgendaCardProps) {
  return (
    <SectionCard title={title} description={description} icon={Clock}>
      {items.length === 0 ? (
        <EmptyState title="Sem compromissos" description="Nenhum evento para hoje." />
      ) : (
        <ol className="space-y-4">
          {items.map((event) => (
            <li key={event.id} className="flex gap-3">
              <span className="w-12 shrink-0 text-sm font-semibold text-primary tabular-nums">
                {event.time}
              </span>
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="truncate text-xs text-muted-foreground">{event.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
