import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CalendarClock, Inbox, Timer, UserCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/query";

import { useCommercialActor } from "../../hooks/useCommercialActor";
import { getLeadsSummary, listAgenda } from "../../services/leadService";
import { describeDeadline } from "../../utils/leadTime";

/**
 * Widgets de Leads do Dashboard.
 *
 * Consomem exclusivamente o Service oficial do módulo, mantendo a arquitetura
 * de Widgets criada na Sprint 01/02 (configuração → dados → apresentação).
 */

function sellerScope(isManager: boolean, actorId: string): string | undefined {
  return isManager ? undefined : actorId;
}

export function LeadsKpisWidget({ title }: { title?: string }) {
  const { actor, isManager, isViewer } = useCommercialActor();
  const scope = isViewer ? undefined : sellerScope(isManager, actor.id);

  const query = useQuery({
    queryKey: ["leads", "summary", scope ?? "todos"],
    queryFn: () => getLeadsSummary(scope),
  });

  if (query.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const summary = query.data;
  if (!summary) return null;

  return (
    <section className="space-y-3">
      {title ? (
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h2>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Leads disponíveis"
          value={String(summary.disponiveis)}
          helper="na fila pública"
          icon={Inbox}
        />
        <StatCard
          label="Aguardando aprovação"
          value={String(summary.aguardandoAprovacao)}
          helper="decisão do gestor em 12h"
          icon={Timer}
        />
        <StatCard
          label="Meus Leads"
          value={String(summary.meusLeads)}
          helper="carteira atual"
          icon={UserCheck}
        />
        <StatCard
          label="Contatos atrasados"
          value={String(summary.contatosAtrasados)}
          helper={`${summary.primeiroContatoPendente} primeiro(s) contato(s) pendente(s)`}
          icon={CalendarClock}
        />
      </div>
    </section>
  );
}

export function LeadsAgendaWidget({
  title = "Próximos contatos",
  description = "Agenda comercial dos Leads",
}: {
  title?: string;
  description?: string;
}) {
  const { actor, isManager, isViewer } = useCommercialActor();
  const scope = isViewer ? undefined : sellerScope(isManager, actor.id);

  const query = useQuery({
    queryKey: ["leads", "agenda", scope ?? "todos"],
    queryFn: () => listAgenda(scope ? { ownerId: scope } : {}),
  });

  const items = (query.data ?? [])
    .filter((item) => item.schedule.status === "pendente")
    .slice(0, 5);

  return (
    <SectionCard title={title} description={description} icon={CalendarClock}>
      {query.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum contato pendente"
          description="Os agendamentos aparecerão aqui automaticamente."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const deadline = describeDeadline(item.schedule.scheduledFor);
            return (
              <li
                key={item.schedule.id}
                className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <Link
                    to="/comercial/leads/$leadId"
                    params={{ leadId: item.leadId }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {item.leadCode}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.requesterName} · {formatDateTime(item.schedule.scheduledFor)}
                  </p>
                </div>
                <StatusBadge
                  label={deadline.label}
                  tone={deadline.tone === "success" ? "success" : deadline.tone}
                />
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
