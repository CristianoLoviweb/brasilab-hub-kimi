import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { DataTable } from "@/components/common/DataTable";
import type { DataTableColumn } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/query";

import {
  LEAD_ORIGIN_LABELS,
  LEAD_PRIORITY_LABELS,
  LEAD_PRIORITY_TONE,
  LEAD_SITUATION_LABELS,
  LEAD_SITUATION_TONE,
} from "../constants/leadDomain";
import type { Lead } from "../types";
import { describeElapsed } from "../utils/leadTime";

interface LeadsTableProps {
  rows: Lead[];
  /** Colunas adicionais conforme o contexto da listagem. */
  showOwner?: boolean;
  showSituation?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Ações contextuais por linha (respeitam as permissões da página). */
  rowActions?: (lead: Lead) => ReactNode;
}

/**
 * Listagem padrão de Leads.
 * Nenhuma informação sensível além do necessário é exibida na tabela
 * (Sprint 03 — item 5).
 */
export function LeadsTable({
  rows,
  showOwner = false,
  showSituation = false,
  emptyTitle = "Nenhum Lead encontrado",
  emptyDescription = "Ajuste a pesquisa ou os filtros aplicados.",
  rowActions,
}: LeadsTableProps) {
  const columns: DataTableColumn<Lead>[] = [
    {
      key: "lead",
      header: "Lead",
      cell: (lead) => (
        <div className="min-w-0">
          <Link
            to="/comercial/leads/$leadId"
            params={{ leadId: lead.id }}
            className="font-medium text-primary hover:underline"
          >
            {lead.code}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {lead.requester.name}
            {lead.requester.company ? ` · ${lead.requester.company}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "interest",
      header: "Interesse",
      hideOnMobile: true,
      cell: (lead) => (
        <span className="line-clamp-2 max-w-[26ch]">{lead.interest.product}</span>
      ),
    },
    {
      key: "local",
      header: "Cidade / UF",
      hideOnMobile: true,
      cell: (lead) =>
        lead.requester.city ? `${lead.requester.city}/${lead.requester.state}` : "—",
    },
    {
      key: "origin",
      header: "Origem",
      hideOnMobile: true,
      cell: (lead) => LEAD_ORIGIN_LABELS[lead.origin],
    },
    {
      key: "createdAt",
      header: "Entrada",
      hideOnMobile: true,
      cell: (lead) => (
        <div>
          <p>{formatDateTime(lead.createdAt)}</p>
          <p className="text-xs text-muted-foreground">
            Aguardando há {describeElapsed(lead.createdAt)}
          </p>
        </div>
      ),
    },
    ...(showOwner
      ? [
          {
            key: "owner",
            header: "Responsável",
            hideOnMobile: true,
            cell: (lead: Lead) =>
              lead.ownerName ?? lead.request?.sellerName ?? "Sem responsável",
          },
        ]
      : []),
    {
      key: "files",
      header: "Arquivos",
      hideOnMobile: true,
      className: "text-center",
      cell: (lead) => (lead.files.length > 0 ? String(lead.files.length) : "—"),
    },
    {
      key: "priority",
      header: "Prioridade",
      className: "text-right",
      cell: (lead) => (
        <StatusBadge
          label={LEAD_PRIORITY_LABELS[lead.priority]}
          tone={LEAD_PRIORITY_TONE[lead.priority]}
        />
      ),
    },
    ...(showSituation
      ? [
          {
            key: "situation",
            header: "Situação",
            className: "text-right",
            cell: (lead: Lead) => (
              <StatusBadge
                label={LEAD_SITUATION_LABELS[lead.situation]}
                tone={LEAD_SITUATION_TONE[lead.situation]}
              />
            ),
          },
        ]
      : []),
    ...(rowActions
      ? [
          {
            key: "actions",
            header: "Ações",
            className: "text-right",
            cell: (lead: Lead) => (
              <div className="flex justify-end gap-2">{rowActions(lead)}</div>
            ),
          },
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(lead) => lead.id}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
