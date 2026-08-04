import { ListChecks } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { PendingMock } from "@/features/dashboard/data/mockDashboard";

const PRIORITY_VARIANT: Record<string, "destructive" | "secondary" | "outline"> = {
  alta: "destructive",
  média: "secondary",
  baixa: "outline",
};

interface PendingTasksCardProps {
  items: PendingMock[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Pending Items. */
export function PendingTasksCard({
  items,
  title = "Pendências",
  description = "Itens que aguardam sua ação",
}: PendingTasksCardProps) {
  return (
    <SectionCard title={title} description={description} icon={ListChecks}>
      {items.length === 0 ? (
        <EmptyState title="Sem pendências" description="Nada aguardando sua ação." />
      ) : (
        <ul className="space-y-3">
          {items.map((task) => (
            <li key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
              <Checkbox className="mt-0.5" aria-label={task.title} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{task.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={PRIORITY_VARIANT[task.priority]}
                    className="text-[10px]"
                  >
                    {task.priority}
                  </Badge>
                  <span>{task.owner}</span>
                  <span>·</span>
                  <span>Prazo: {task.due}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
