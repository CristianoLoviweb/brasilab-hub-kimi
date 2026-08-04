import { Gauge } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { StatusSummaryItem, StatusTone } from "@/features/dashboard/data/widgetData";
import { cn } from "@/lib/utils";

const TONE_CLASS: Record<StatusTone, string> = {
  neutral: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

interface StatusSummaryCardProps {
  items: StatusSummaryItem[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Status Summary. */
export function StatusSummaryCard({
  items,
  title = "Resumo",
  description = "Situação atual",
}: StatusSummaryCardProps) {
  return (
    <SectionCard title={title} description={description} icon={Gauge}>
      {items.length === 0 ? (
        <EmptyState title="Sem dados" description="Nenhuma informação disponível." />
      ) : (
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="min-w-0 truncate text-sm text-muted-foreground">
                {item.label}
              </span>
              <span
                className={cn(
                  "shrink-0 text-sm font-semibold tabular-nums",
                  TONE_CLASS[item.tone],
                )}
              >
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
