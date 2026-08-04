import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { TablePagination } from "@/components/common/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditTimeline } from "@/features/audit/components/AuditTimeline";
import { getAuditSummary, listAuditEvents } from "@/features/audit/services/auditService";
import { AUDIT_ENTITY_LABELS } from "@/features/audit/types";
import type { AuditEntity, AuditSeverity } from "@/features/audit/types";

export const Route = createFileRoute("/_authenticated/administracao/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria · Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Trilha imutável de eventos da Brasilab Intranet Lab: quem executou, o que foi feito e quando.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Auditoria · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Registros imutáveis de todas as ações relevantes da plataforma.",
      },
    ],
  }),
  component: AuditoriaPage,
});

const SEVERITIES: Record<AuditSeverity, string> = {
  informativo: "Informativo",
  atencao: "Atenção",
  critico: "Crítico",
};

function AuditoriaPage() {
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState<AuditEntity | "todas">("todas");
  const [severity, setSeverity] = useState<AuditSeverity | "todas">("todas");
  const [page, setPage] = useState(1);

  const summary = useQuery({ queryKey: ["audit", "summary"], queryFn: getAuditSummary });
  const query = useQuery({
    queryKey: ["audit", "list", { search, entity, severity, page }],
    queryFn: () => listAuditEvents({ search, entity, severity, page }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoria"
        description="Registro cronológico e imutável das ações executadas na plataforma."
        icon={History}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Eventos" value={String(summary.data?.total ?? "—")} icon={History} />
        <StatCard
          label="Eventos críticos"
          value={String(summary.data?.criticos ?? "—")}
          icon={History}
        />
        <StatCard label="Hoje" value={String(summary.data?.hoje ?? "—")} icon={History} />
        <StatCard
          label="Entidades auditadas"
          value={String(summary.data?.entidades ?? "—")}
          icon={History}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Pesquisar por descrição, usuário ou código"
        />
        <Select
          value={entity}
          onValueChange={(value) => {
            setEntity(value as AuditEntity | "todas");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Entidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as entidades</SelectItem>
            {Object.entries(AUDIT_ENTITY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={severity}
          onValueChange={(value) => {
            setSeverity(value as AuditSeverity | "todas");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Severidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as severidades</SelectItem>
            {Object.entries(SEVERITIES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SectionCard
        title="Linha do tempo"
        description="Os registros de auditoria nunca podem ser alterados ou excluídos."
      >
        {query.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <>
            <AuditTimeline events={query.data?.items ?? []} />
            <div className="mt-4">
              <TablePagination
                page={query.data?.page ?? 1}
                totalPages={query.data?.totalPages ?? 1}
                total={query.data?.total ?? 0}
                pageSize={query.data?.pageSize ?? 10}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
