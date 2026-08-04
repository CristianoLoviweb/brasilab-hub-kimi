import { Activity } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import type { ActivityMock } from "@/features/dashboard/data/mockDashboard";

const TYPE_LABEL: Record<string, string> = {
  comercial: "Comercial",
  producao: "Produção",
  compras: "Compras",
  financeiro: "Financeiro",
};

interface RecentActivityCardProps {
  items: ActivityMock[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Activity List. */
export function RecentActivityCard({
  items,
  title = "Atividades recentes",
  description = "Últimos eventos registrados na plataforma",
}: RecentActivityCardProps) {
  return (
    <SectionCard title={title} description={description} icon={Activity}>
      {items.length === 0 ? (
        <EmptyState
          title="Sem atividades"
          description="Nenhum evento registrado no período."
        />
      ) : (
        <ol className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{item.user}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>{" "}
                  <span className="font-medium">{item.target}</span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {TYPE_LABEL[item.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
