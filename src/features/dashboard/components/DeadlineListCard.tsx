import { CalendarClock } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import type { DeadlineItem, StatusTone } from "@/features/dashboard/data/widgetData";

const TONE_VARIANT: Record<StatusTone, "default" | "secondary" | "destructive" | "outline"> =
  {
    neutral: "outline",
    success: "secondary",
    warning: "secondary",
    danger: "destructive",
  };

interface DeadlineListCardProps {
  items: DeadlineItem[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Deadline List. */
export function DeadlineListCard({
  items,
  title = "Prazos",
  description = "Itens com data próxima",
}: DeadlineListCardProps) {
  return (
    <SectionCard title={title} description={description} icon={CalendarClock}>
      {items.length === 0 ? (
        <EmptyState title="Sem prazos" description="Nenhum item no período." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <Badge variant={TONE_VARIANT[item.tone]} className="shrink-0 text-[10px]">
                {item.date}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
