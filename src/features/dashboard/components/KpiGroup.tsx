import { TrendingUp } from "lucide-react";

import { StatCard } from "@/components/common/StatCard";
import type { KpiMock } from "@/features/dashboard/data/mockDashboard";

interface KpiGroupProps {
  items: KpiMock[];
  title?: string;
}

/** Widget reutilizável: grupo de KPI Cards. */
export function KpiGroup({ items, title }: KpiGroupProps) {
  return (
    <section className="space-y-3">
      {title ? (
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h2>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((kpi) => (
          <StatCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            helper={kpi.helper}
            trend={kpi.trend}
            icon={TrendingUp}
          />
        ))}
      </div>
    </section>
  );
}
