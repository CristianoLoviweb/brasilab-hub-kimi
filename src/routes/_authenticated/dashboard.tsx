import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { useAccessGroup } from "@/features/access/hooks/useAccessGroup";
import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";
import { getDashboardConfig } from "@/features/dashboard/config/dashboardConfig";
import { getDashboardProfileConfig } from "@/features/dashboard/config/profileDashboards";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Painel executivo da Brasilab: indicadores comerciais e operacionais, agenda, pendências e atividades recentes.",
      },
      { property: "og:title", content: "Dashboard · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content:
          "Painel executivo com indicadores, agenda, pendências e atividades da Brasilab.",
      },
    ],
  }),
  component: DashboardPage,
});

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function DashboardPage() {
  const { user } = useAuth();
  const { group, code, profileId } = useAccessGroup();
  const firstName = user?.name?.split(" ")[0] ?? "usuário";
  const config = getDashboardConfig(code);
  const profileConfig = getDashboardProfileConfig(profileId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description={`${profileConfig?.title ?? config.title} · ${config.description}`}
        icon={LayoutDashboard}
      />

      <DashboardGrid group={group} profileId={profileId} />
    </div>
  );
}
