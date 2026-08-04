import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Timer, X } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadReasonDialog } from "@/features/leads/components/dialogs/LeadActionDialogs";
import { LEAD_PERMISSIONS } from "@/features/leads/constants/leadPermissions";
import { LEAD_APPROVAL_DEADLINE_HOURS } from "@/features/leads/constants/leadTiming";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import {
  approveRequest,
  listPendingRequests,
  rejectRequest,
} from "@/features/leads/services/leadService";
import { describeDeadline } from "@/features/leads/utils/leadTime";
import { formatDateTime } from "@/lib/query";

export const Route = createFileRoute("/_authenticated/comercial/leads/aprovacoes")({
  head: () => ({
    meta: [
      { title: "Aprovações de Leads · Comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Solicitações de atribuição de Leads aguardando decisão do gestor comercial dentro do prazo de 12 horas.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Aprovações de Leads · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Decisão do gestor sobre solicitações de atribuição de Leads.",
      },
    ],
  }),
  component: AprovacoesPage,
});

function AprovacoesPage() {
  const queryClient = useQueryClient();
  const { actor, can } = useCommercialActor();

  const query = useQuery({
    queryKey: ["leads", "aprovacoes"],
    queryFn: listPendingRequests,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["leads"] });

  const approve = useMutation({
    mutationFn: (leadId: string) => approveRequest(leadId, actor),
    onSuccess: (lead) => {
      toast.success(`Solicitação aprovada. Lead ${lead.code} atribuído.`);
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reject = useMutation({
    mutationFn: (input: { leadId: string; reason: string }) =>
      rejectRequest(input.leadId, actor, input.reason),
    onSuccess: (lead) => {
      toast.success(`Solicitação recusada. Lead ${lead.code} retornou à fila.`);
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const canDecide =
    can(LEAD_PERMISSIONS.aprovarAtribuicao) && can(LEAD_PERMISSIONS.recusarAtribuicao);

  const rows = query.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aprovações de atribuição"
        description={`Solicitações aguardando decisão. Sem decisão em ${LEAD_APPROVAL_DEADLINE_HOURS} horas, a aprovação ocorre automaticamente.`}
        icon={Timer}
      />

      {query.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nenhuma solicitação pendente"
          description="Todas as solicitações já foram decididas ou aprovadas automaticamente por expiração."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((lead) => {
            const request = lead.request!;
            const deadline = describeDeadline(request.deadlineAt);

            return (
              <SectionCard
                key={lead.id}
                title={`${lead.code} · ${lead.requester.name}`}
                description={`${lead.requester.company || "Sem empresa informada"} · ${lead.interest.product}`}
                actions={<StatusBadge label={deadline.label} tone={deadline.tone} />}
              >
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Solicitado por <strong>{request.sellerName}</strong> em{" "}
                    {formatDateTime(request.requestedAt)}.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prazo de decisão: {formatDateTime(request.deadlineAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/comercial/leads/$leadId" params={{ leadId: lead.id }}>
                        Ver detalhes
                      </Link>
                    </Button>
                    {canDecide ? (
                      <>
                        <Button
                          size="sm"
                          disabled={approve.isPending}
                          onClick={() => approve.mutate(lead.id)}
                        >
                          <Check className="h-4 w-4" />
                          Aprovar
                        </Button>
                        <LeadReasonDialog
                          title="Recusar solicitação"
                          description="A justificativa é obrigatória e será registrada no Histórico."
                          label="Justificativa"
                          confirmLabel="Recusar"
                          submitting={reject.isPending}
                          onSubmit={async (reason) => {
                            await reject.mutateAsync({ leadId: lead.id, reason });
                          }}
                          trigger={
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4" />
                              Recusar
                            </Button>
                          }
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
