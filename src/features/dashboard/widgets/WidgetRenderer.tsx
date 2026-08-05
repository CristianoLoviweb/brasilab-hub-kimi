import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/common/EmptyState";
import { AgendaCard } from "@/features/dashboard/components/AgendaCard";
import { ChartCard } from "@/features/dashboard/components/DashboardCharts";
import { DeadlineListCard } from "@/features/dashboard/components/DeadlineListCard";
import { KpiGroup } from "@/features/dashboard/components/KpiGroup";
import { NoticesCard } from "@/features/dashboard/components/NoticesCard";
import { PendingTasksCard } from "@/features/dashboard/components/PendingTasksCard";
import { QuickActionsCard } from "@/features/dashboard/components/QuickActionsCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { StatusSummaryCard } from "@/features/dashboard/components/StatusSummaryCard";
import { getWidgetData } from "@/features/dashboard/data/widgetData";
import { resolveWidgetData } from "@/features/dashboard/services/dashboardService";
import {
  LeadsAgendaWidget,
  LeadsKpisWidget,
} from "@/features/leads/components/widgets/LeadsWidgets";
import type { DashboardWidget } from "@/features/dashboard/types";

/**
 * Registry de Widgets: liga a configuração (código + dados) ao componente
 * reutilizável responsável pela apresentação.
 *
 * Os dados são sempre calculados dinamicamente pelo Service oficial do
 * Dashboard (resolveWidgetData): a cada montagem os indicadores são
 * recalculados a partir dos Services dos módulos, então qualquer ação
 * (criar Lead, registrar contato, agendar, anexar arquivo…) reflete-se
 * automaticamente no Dashboard.
 */
export function WidgetRenderer({ widget }: { widget: DashboardWidget }) {
  // Widgets de Leads consomem o Service oficial do módulo (dados vivos).
  if (widget.component === "leads-kpis") {
    return <LeadsKpisWidget {...(widget.title ? { title: widget.title } : {})} />;
  }
  if (widget.component === "leads-agenda") {
    return (
      <LeadsAgendaWidget
        {...(widget.title ? { title: widget.title } : {})}
        {...(widget.description ? { description: widget.description } : {})}
      />
    );
  }

  return <ServiceDrivenWidget widget={widget} />;
}

function ServiceDrivenWidget({ widget }: { widget: DashboardWidget }) {
  const query = useQuery({
    queryKey: ["dashboard", "widget", widget.dataKey],
    queryFn: () => resolveWidgetData(widget.dataKey),
    // Base do catálogo como valor imediato; o Service recalcula em seguida.
    initialData: () => getWidgetData(widget.dataKey),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const data = query.data;

  if (!data || data.kind !== widget.component) {
    return (
      <EmptyState
        title="Widget indisponível"
        description={`Sem dados disponíveis para "${widget.code}".`}
      />
    );
  }

  const title = widget.title;
  const description = widget.description;
  const optional = {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };

  switch (data.kind) {
    case "kpi-group":
      return <KpiGroup items={data.items} {...(title ? { title } : {})} />;
    case "chart":
      return (
        <ChartCard
          chart={data.chart}
          title={title ?? "Gráfico"}
          {...(description ? { description } : {})}
        />
      );
    case "activity-list":
      return <RecentActivityCard items={data.items} {...optional} />;
    case "agenda":
      return <AgendaCard items={data.items} {...optional} />;
    case "pending-items":
      return <PendingTasksCard items={data.items} {...optional} />;
    case "quick-actions":
      return <QuickActionsCard slugs={data.slugs} {...optional} />;
    case "notices":
      return <NoticesCard items={data.items} {...optional} />;
    case "status-summary":
      return <StatusSummaryCard items={data.items} {...optional} />;
    case "deadline-list":
      return <DeadlineListCard items={data.items} {...optional} />;
    default:
      return null;
  }
}
