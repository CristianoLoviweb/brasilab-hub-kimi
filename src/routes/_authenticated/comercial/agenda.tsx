import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LEAD_SCHEDULE_STATUS_LABELS,
  LEAD_SCHEDULE_STATUS_TONE,
} from "@/features/leads/constants/leadDomain";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import { listAgenda } from "@/features/leads/services/leadService";
import { describeDeadline } from "@/features/leads/utils/leadTime";
import { formatDateTime } from "@/lib/query";

export const Route = createFileRoute("/_authenticated/comercial/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Agenda comercial da Brasilab: primeiros contatos obrigatórios, retornos agendados e compromissos por vendedor.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Agenda comercial · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Primeiros contatos e retornos agendados do módulo Comercial.",
      },
    ],
  }),
  component: AgendaComercialPage,
});

type AgendaFilter = "pendentes" | "atrasados" | "primeiro_contato" | "todos";

function AgendaComercialPage() {
  const { actor, isManager, isViewer } = useCommercialActor();
  const scope = isManager || isViewer ? undefined : actor.id;
  const [filter, setFilter] = useState<AgendaFilter>("pendentes");

  const query = useQuery({
    queryKey: ["leads", "agenda", scope ?? "todos"],
    queryFn: () => listAgenda(scope ? { ownerId: scope } : {}),
  });

  const now = Date.now();
  const items = (query.data ?? []).filter((item) => {
    if (filter === "todos") return true;
    if (filter === "primeiro_contato") {
      return item.schedule.isFirstContact && item.schedule.status === "pendente";
    }
    if (filter === "atrasados") {
      return (
        item.schedule.status === "pendente" &&
        new Date(item.schedule.scheduledFor).getTime() < now
      );
    }
    return item.schedule.status === "pendente";
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda comercial"
        description="Primeiros contatos obrigatórios, retornos e compromissos agendados nos Leads."
        icon={CalendarClock}
        actions={
          <Select value={filter} onValueChange={(value) => setFilter(value as AgendaFilter)}>
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder="Filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendentes">Pendentes</SelectItem>
              <SelectItem value="atrasados">Atrasados</SelectItem>
              <SelectItem value="primeiro_contato">Primeiro contato</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {query.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum compromisso encontrado"
          description="Os agendamentos são criados na atribuição do Lead e no registro de contatos."
        />
      ) : (
        <SectionCard
          title="Compromissos"
          description={`${items.length} registro(s) conforme o filtro aplicado.`}
        >
          <ul className="divide-y">
            {items.map((item) => {
              const deadline = describeDeadline(item.schedule.scheduledFor);
              return (
                <li
                  key={item.schedule.id}
                  className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/comercial/leads/$leadId"
                        params={{ leadId: item.leadId }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {item.leadCode}
                      </Link>
                      {item.schedule.isFirstContact ? (
                        <StatusBadge label="Primeiro contato" tone="info" />
                      ) : null}
                      <StatusBadge
                        label={LEAD_SCHEDULE_STATUS_LABELS[item.schedule.status]}
                        tone={LEAD_SCHEDULE_STATUS_TONE[item.schedule.status]}
                      />
                    </div>
                    <p className="text-sm">{item.schedule.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.requesterName}
                      {item.company ? ` · ${item.company}` : ""} · {item.schedule.ownerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDateTime(item.schedule.scheduledFor)}
                    </p>
                    {item.schedule.status === "pendente" ? (
                      <StatusBadge label={deadline.label} tone={deadline.tone} />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
