import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserCheck } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { TablePagination } from "@/components/common/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { LEAD_SITUATION_LABELS } from "@/features/leads/constants/leadDomain";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import { listAllLeads, listMyLeads } from "@/features/leads/services/leadService";
import type { LeadSituation } from "@/features/leads/types";

export const Route = createFileRoute("/_authenticated/comercial/leads/meus")({
  head: () => ({
    meta: [
      { title: "Meus Leads · Comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Carteira comercial do vendedor: Leads atribuídos, prazos de primeiro contato e situações em andamento.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Meus Leads · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Carteira de Leads atribuídos e prazos de atendimento.",
      },
    ],
  }),
  component: MeusLeadsPage,
});

function MeusLeadsPage() {
  const { actor, isManager, isViewer } = useCommercialActor();
  const seeAll = isManager || isViewer;

  const [search, setSearch] = useState("");
  const [situation, setSituation] = useState<LeadSituation | "todas">("todas");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["leads", "meus", actor.id, seeAll, { search, situation, page }],
    queryFn: () =>
      seeAll
        ? listAllLeads({ search, situation, page })
        : listMyLeads(actor.id, { search, situation, page }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={seeAll ? "Leads atribuídos" : "Meus Leads"}
        description={
          seeAll
            ? "Visão completa da carteira comercial — disponível para gestão e Diretoria."
            : "Leads sob sua responsabilidade, incluindo solicitações aguardando decisão do gestor."
        }
        icon={UserCheck}
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Pesquisar por código, solicitante ou empresa"
        />
        <Select
          value={situation}
          onValueChange={(value) => {
            setSituation(value as LeadSituation | "todas");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as situações</SelectItem>
            {Object.entries(LEAD_SITUATION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
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
            showOwner={seeAll}
            showSituation
            emptyTitle="Nenhum Lead na carteira"
            emptyDescription="Solicite um Lead na fila de disponíveis para iniciar o atendimento."
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
