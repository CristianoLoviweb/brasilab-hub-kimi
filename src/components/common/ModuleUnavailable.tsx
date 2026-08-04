import { Construction } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import type { NavigationItem } from "@/config/navigation";

/** Página padrão dos módulos previstos no ROADMAP e ainda não implementados. */
export function ModuleUnavailable({ module }: { module: NavigationItem }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={module.label}
        description={module.description}
        icon={module.icon}
        actions={<Badge variant="secondary">{module.phase}</Badge>}
      />
      <EmptyState
        icon={Construction}
        title="Este módulo será desenvolvido em uma Sprint futura."
        description={`O módulo ${module.label} está previsto no roadmap oficial da plataforma (${module.phase}). A navegação e a estrutura já estão preparadas para recebê-lo.`}
      />
    </div>
  );
}
