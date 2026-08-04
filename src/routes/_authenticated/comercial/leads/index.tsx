import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HandHeart, Inbox, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { TablePagination } from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import {
  LEAD_ORIGIN_LABELS,
  LEAD_PRIORITY_LABELS,
} from "@/features/leads/constants/leadDomain";
import { LEAD_APPROVAL_DEADLINE_HOURS } from "@/features/leads/constants/leadTiming";
import { LEAD_PERMISSIONS } from "@/features/leads/constants/leadPermissions";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import {
  listAvailableLeads,
  requestLead,
} from "@/features/leads/services/leadService";
import type { LeadOrigin, LeadPriority } from "@/features/leads/types";

export const Route = createFileRoute("/_authenticated/comercial/leads/")({
  head: () => ({
    meta: [
      { title: "Leads disponíveis · Comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Fila pública de Leads da Brasilab: oportunidades sem responsável, disponíveis para solicitação pelos vendedores.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Leads disponíveis · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Fila pública de oportunidades comerciais aguardando atendimento.",
      },
    ],
  }),
  component: LeadsDisponiveisPage,
});

function LeadsDisponiveisPage() {
  const queryClient = useQueryClient();
  const { actor, can } = useCommercialActor();

  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState<LeadOrigin | "todas">("todas");
  const [priority, setPriority] = useState<LeadPriority | "todas">("todas");
  const [sort, setSort] = useState<"recentes" | "antigos" | "prioridade">("antigos");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["leads", "disponiveis", { search, origin, priority, sort, page }],
    queryFn: () => listAvailableLeads({ search, origin, priority, sort, page }),
  });

  const request = useMutation({
    mutationFn: (leadId: string) => requestLead(leadId, actor),
    onSuccess: (lead) => {
      toast.success(
        `Solicitação enviada para o Lead ${lead.code}. O gestor possui ${LEAD_APPROVAL_DEADLINE_HOURS} horas para decidir.`,
      );
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads disponíveis"
        description={`Fila pública de oportunidades sem responsável. A solicitação reserva o Lead e aguarda decisão do gestor em ${LEAD_APPROVAL_DEADLINE_HOURS} horas.`}
        icon={Inbox}
        actions={
          can(LEAD_PERMISSIONS.criar) ? (
            <Button asChild variant="outline">
              <Link to="/comercial/leads/novo">
                <Plus className="h-4 w-4" />
                Novo Lead
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Pesquisar por código, solicitante, empresa ou cidade"
        />
        <Select
          value={origin}
          onValueChange={(value) => {
            setOrigin(value as LeadOrigin | "todas");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as origens</SelectItem>
            {Object.entries(LEAD_ORIGIN_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={priority}
          onValueChange={(value) => {
            setPriority(value as LeadPriority | "todas");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as prioridades</SelectItem>
            {Object.entries(LEAD_PRIORITY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value as "recentes" | "antigos" | "prioridade");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Ordenação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="antigos">Aguardando há mais tempo</SelectItem>
            <SelectItem value="recentes">Entradas mais recentes</SelectItem>
            <SelectItem value="prioridade">Maior prioridade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <LeadsTable
            rows={query.data?.items ?? []}
            emptyTitle="Nenhum Lead disponível"
            emptyDescription="Todos os Leads da fila já possuem responsável ou solicitação em análise."
            {...(can(LEAD_PERMISSIONS.solicitar)
              ? {
                  rowActions: (lead) => (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={request.isPending}
                      onClick={() => request.mutate(lead.id)}
                    >
                      <HandHeart className="h-4 w-4" />
                      Solicitar
                    </Button>
                  ),
                }
              : {})}
          />
          <TablePagination
            page={query.data?.page ?? 1}
            totalPages={query.data?.totalPages ?? 1}
            total={query.data?.total ?? 0}
            pageSize={query.data?.pageSize ?? 10}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
