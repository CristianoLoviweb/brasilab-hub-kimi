import { EmptyState } from "@/components/common/EmptyState";
import { isModuleAllowed } from "@/features/access/config/accessGroups";
import type { AccessGroup } from "@/features/access/types";
import { getDashboardConfig } from "@/features/dashboard/config/dashboardConfig";
import { getDashboardProfileConfig } from "@/features/dashboard/config/profileDashboards";
import type { DashboardWidget } from "@/features/dashboard/types";
import { WidgetRenderer } from "@/features/dashboard/widgets/WidgetRenderer";
import { cn } from "@/lib/utils";

const SPAN_CLASS: Record<DashboardWidget["span"], string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

/**
 * Resolução do Dashboard:
 * Grupo → Perfil → Widgets autorizados → Ordem → Dados → Renderização.
 *
 * Nível 1: configuração padrão do Grupo.
 * Nível 2: sobrescrita do Perfil (visibilidade, ordem e largura).
 * Nível 3: preferências do usuário (Sprint futura) — mesmo contrato.
 *
 * A filtragem por módulo é apenas visual. A validação definitiva ocorrerá no
 * backend (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */
export function resolveWidgets(
  group: AccessGroup,
  profileId?: string | null,
): DashboardWidget[] {
  const overrides = getDashboardProfileConfig(profileId)?.widgets ?? [];
  const overrideMap = new Map(overrides.map((item) => [item.code, item]));

  return getDashboardConfig(group.code)
    .widgets.map((widget) => {
      const override = overrideMap.get(widget.code);
      if (!override) return widget;
      return {
        ...widget,
        visible: override.visible ?? widget.visible,
        order: override.order ?? widget.order,
        span: override.span ?? widget.span,
      };
    })
    .filter((widget) => widget.visible)
    .filter((widget) => isModuleAllowed(group, widget.module))
    .sort((a, b) => a.order - b.order);
}

export function DashboardGrid({
  group,
  profileId,
}: {
  group: AccessGroup;
  profileId?: string | null;
}) {
  const widgets = resolveWidgets(group, profileId);

  if (widgets.length === 0) {
    return (
      <EmptyState
        title="Nenhum widget disponível"
        description="O Grupo de Acesso atual não possui widgets liberados."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {widgets.map((widget) => (
        <div key={widget.code} className={cn("min-w-0", SPAN_CLASS[widget.span])}>
          <WidgetRenderer widget={widget} />
        </div>
      ))}
    </div>
  );
}
