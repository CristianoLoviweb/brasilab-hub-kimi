import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  Handshake,
  Inbox,
  Plus,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import { LEAD_PERMISSIONS } from "@/features/leads/constants/leadPermissions";
import { getLeadsSummary } from "@/features/leads/services/leadService";

export const Route = createFileRoute("/_authenticated/comercial/")({
  head: () => ({
    meta: [
      { title: "Comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Módulo Comercial da Brasilab: fila de Leads, carteira, aprovações de atribuição e agenda de contatos.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Comercial · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Fila de Leads, carteira comercial, aprovações e agenda de contatos.",
      },
    ],
  }),
  component: ComercialPage,
});

const SECTIONS = [
  {
    to: "/comercial/leads",
    label: "Leads disponíveis",
    description: "Fila pública de oportunidades sem responsável.",
    icon: Inbox,
  },
  {
    to: "/comercial/leads/meus",
    label: "Meus Leads",
    description: "Carteira do vendedor e prazos de primeiro contato.",
    icon: UserCheck,
  },
  {
    to: "/comercial/leads/aprovacoes",
    label: "Aprovações",
    description: "Solicitações aguardando decisão do gestor em 12 horas.",
    icon: Timer,
  },
  {
    to: "/comercial/agenda",
    label: "Agenda comercial",
    description: "Primeiros contatos, retornos e compromissos agendados.",
    icon: CalendarClock,
  },
] as const;

function ComercialPage() {
  const { actor, isManager, isViewer, can } = useCommercialActor();
  const scope = isManager || isViewer ? undefined : actor.id;

  const query = useQuery({
    queryKey: ["leads", "summary", scope ?? "todos"],
    queryFn: () => getLeadsSummary(scope),
  });

  const summary = query.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comercial"
        description="Fila de Leads, carteira, aprovações de atribuição e agenda de contatos."
        icon={Handshake}
        actions={
          can(LEAD_PERMISSIONS.criar) ? (
            <Button asChild>
              <Link to="/comercial/leads/novo">
                <Plus className="h-4 w-4" />
                Novo Lead
              </Link>
            </Button>
          ) : null
        }
      />

      {query.isPending || !summary ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Leads disponíveis"
            value={String(summary.disponiveis)}
            helper="fila pública"
            icon={Inbox}
          />
          <StatCard
            label="Aguardando aprovação"
            value={String(summary.aguardandoAprovacao)}
            helper="prazo de 12 horas"
            icon={Timer}
          />
          <StatCard
            label={isManager || isViewer ? "Leads atribuídos" : "Meus Leads"}
            value={String(summary.meusLeads)}
            helper="em atendimento"
            icon={Users}
          />
          <StatCard
            label="Contatos atrasados"
            value={String(summary.contatosAtrasados)}
            helper={`${summary.contatosHoje} contato(s) hoje`}
            icon={CalendarClock}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className="group">
            <Card className="h-full shadow-card transition-colors group-hover:border-primary/40">
              <CardHeader className="flex flex-row items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <section.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-base">{section.label}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Sprint 03 · Módulo de Leads
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
