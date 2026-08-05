import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { listAuditEvents } from "./auditService.server";
import type { AuditEntity, AuditEvent } from "@/features/audit/types";
import { formatDateTime } from "@/lib/query";

import {
  listAgenda,
  listAllLeads,
  listPendingRequests,
  type LeadAgendaItem,
} from "./leadService.server";
import type { Lead } from "@/features/leads/types";

import { WIDGET_DATA } from "@/features/dashboard/data/widgetData";
import type {
  ActivityItem,
  AgendaItem,
  DeadlineItem,
  KpiItem,
  PendingItem,
  StatusTone,
  WidgetData,
} from "@/features/dashboard/data/widgetData";

/**
 * Service oficial do Dashboard.
 *
 * Todos os indicadores são calculados dinamicamente a partir dos Services
 * dos módulos (Leads, Auditoria…). Os indicadores cujos módulos ainda não
 * possuem fonte de dados (Propostas, Pedidos, Produção, Compras, Financeiro,
 * Logística e Engenharia) permanecem zerados — zeros reais, derivados da
 * base vazia, nunca números fictícios.
 *
 * Sprint 03.2: as consultas executam nos Services do servidor, sobre dados
 * reais do PostgreSQL. O contrato público permanece exatamente o mesmo.
 */

const NO_TREND = { direction: "neutral", value: "—" } as const;

/** Limite de linhas lidas por consulta — suficiente para a etapa atual. */
const READ_ALL = { pageSize: 1000 } as const;

/* ------------------------------------------------------------ utilidades */

function monthBounds(offset: number): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
}

function countInRange(leads: Lead[], offset: number): number {
  const { start, end } = monthBounds(offset);
  return leads.filter((lead) => {
    const created = new Date(lead.createdAt);
    return created >= start && created < end;
  }).length;
}

function buildTrend(current: number, previous: number): KpiItem["trend"] {
  if (current === previous) return NO_TREND;
  const direction = current > previous ? "up" : "down";
  const value =
    previous === 0 ? "100%" : `${Math.abs(Math.round(((current - previous) / previous) * 100))}%`;
  return { direction, value };
}

function conversionRate(leads: Lead[]): string {
  if (leads.length === 0) return "0%";
  const converted = leads.filter((lead) => lead.situation === "convertido").length;
  return `${Math.round((converted / leads.length) * 100)}%`;
}

function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
}

function timeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isWithinNextDays(iso: string, days: number): boolean {
  const time = new Date(iso).getTime();
  const now = Date.now();
  return time >= now && time <= now + days * 24 * 60 * 60 * 1000;
}

/* ------------------------------------------------------ dados consolidados */

async function loadLeads(): Promise<Lead[]> {
  const result = await listAllLeads(READ_ALL);
  return result.items;
}

const ACTIVITY_TYPE_BY_ENTITY: Record<AuditEntity, ActivityItem["type"]> = {
  lead: "comercial",
  usuario: "administracao",
  grupo: "administracao",
  perfil: "administracao",
  permissao: "administracao",
  sessao: "administracao",
  dashboard: "administracao",
};

function toActivityItem(event: AuditEvent): ActivityItem {
  return {
    id: event.id,
    user: event.actorName,
    action: event.description,
    target: "",
    time: relativeTime(event.occurredAt),
    type: ACTIVITY_TYPE_BY_ENTITY[event.entity],
  };
}

async function listRecentActivities(entity?: AuditEntity): Promise<ActivityItem[]> {
  const result = await listAuditEvents({
    pageSize: 6,
    ...(entity ? { entity } : {}),
  });
  return result.items.map(toActivityItem);
}

function toAgendaItem(item: LeadAgendaItem): AgendaItem {
  return {
    id: item.schedule.id,
    time: timeOfDay(item.schedule.scheduledFor),
    title: `${item.leadCode} · ${item.requesterName}`,
    detail: item.schedule.title,
  };
}

async function listTodayAgenda(): Promise<AgendaItem[]> {
  const agenda = await listAgenda();
  return agenda
    .filter((item) => item.schedule.status === "pendente")
    .filter((item) => isToday(item.schedule.scheduledFor))
    .slice(0, 6)
    .map(toAgendaItem);
}

async function listLeadPendingItems(): Promise<PendingItem[]> {
  const requests = await listPendingRequests();
  return requests.slice(0, 6).map((lead) => {
    const request = lead.request!;
    const expired = new Date(request.deadlineAt).getTime() < Date.now();
    return {
      id: request.id,
      title: `Aprovar atribuição do Lead ${lead.code}`,
      owner: request.sellerName,
      priority: expired ? "alta" : "média",
      due: `Prazo: ${formatDateTime(request.deadlineAt)}`,
    };
  });
}

function deadlineTone(iso: string): StatusTone {
  const hours = (new Date(iso).getTime() - Date.now()) / 3_600_000;
  if (hours < 0) return "danger";
  if (hours <= 4) return "warning";
  return "neutral";
}

async function listCommercialDeadlines(): Promise<DeadlineItem[]> {
  const [requests, agenda] = await Promise.all([listPendingRequests(), listAgenda()]);

  const fromRequests = requests.map((lead) => {
    const request = lead.request!;
    return {
      iso: request.deadlineAt,
      item: {
        id: `req-${request.id}`,
        title: `Aprovação de atribuição — ${lead.code}`,
        detail: `Solicitada por ${request.sellerName}`,
        date: formatDateTime(request.deadlineAt),
        tone: deadlineTone(request.deadlineAt),
      },
    };
  });

  const fromSchedules = agenda
    .filter((item) => item.schedule.status === "pendente")
    .filter((item) => isWithinNextDays(item.schedule.scheduledFor, 2))
    .map((item) => ({
      iso: item.schedule.scheduledFor,
      item: {
        id: `sch-${item.schedule.id}`,
        title: `${item.schedule.isFirstContact ? "Primeiro contato" : "Contato"} — ${item.leadCode}`,
        detail: item.requesterName,
        date: formatDateTime(item.schedule.scheduledFor),
        tone: deadlineTone(item.schedule.scheduledFor),
      },
    }));

  return [...fromRequests, ...fromSchedules]
    .sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime())
    .slice(0, 6)
    .map((entry) => entry.item);
}

/* --------------------------------------------------------------- consultas */

async function computeCommercialKpis(prefix: string): Promise<WidgetData> {
  const leads = await loadLeads();
  const currentMonth = countInRange(leads, 0);
  const previousMonth = countInRange(leads, -1);
  const trend = buildTrend(currentMonth, previousMonth);
  const conversion = conversionRate(leads);

  if (prefix === "consolidado") {
    return {
      kind: "kpi-group",
      items: [
        {
          id: "leads",
          label: "Leads no mês",
          value: String(currentMonth),
          helper: "vs. mês anterior",
          trend,
        },
        {
          id: "propostas",
          label: "Propostas em aberto",
          value: "0",
          helper: "em negociação",
          trend: NO_TREND,
        },
        {
          id: "conversao",
          label: "Taxa de conversão",
          value: conversion,
          helper: "base total de Leads",
          trend: NO_TREND,
        },
        {
          id: "pedidos",
          label: "Pedidos confirmados",
          value: "0",
          helper: "no mês",
          trend: NO_TREND,
        },
      ],
    };
  }

  const agenda = await listAgenda();
  const scheduledNext7Days = agenda
    .filter((item) => item.schedule.status === "pendente")
    .filter((item) => isWithinNextDays(item.schedule.scheduledFor, 7)).length;

  return {
    kind: "kpi-group",
    items: [
      {
        id: "c-leads",
        label: "Leads recebidos",
        value: String(currentMonth),
        helper: "no mês",
        trend,
      },
      {
        id: "c-contatos",
        label: "Contatos agendados",
        value: String(scheduledNext7Days),
        helper: "próximos 7 dias",
        trend: NO_TREND,
      },
      {
        id: "c-propostas",
        label: "Propostas em aberto",
        value: "0",
        helper: "em negociação",
        trend: NO_TREND,
      },
      {
        id: "c-conversao",
        label: "Taxa de conversão",
        value: conversion,
        helper: "base total de Leads",
        trend: NO_TREND,
      },
    ],
  };
}

/**
 * Resolve os dados de um Widget calculando-os nos Services oficiais.
 * Chaves sem fonte de dados dinâmica retornam a base zerada do catálogo.
 */
export async function resolveWidgetData(dataKey: string): Promise<WidgetData | undefined> {
  switch (dataKey) {
    case "consolidado.kpisComerciais":
      return computeCommercialKpis("consolidado");
    case "comercial.kpis":
      return computeCommercialKpis("comercial");

    case "consolidado.atividades":
      return { kind: "activity-list", items: await listRecentActivities() };
    case "comercial.atividades":
      return { kind: "activity-list", items: await listRecentActivities("lead") };

    case "consolidado.agenda":
    case "comercial.agenda":
    case "producao.agenda":
    case "logistica.agenda":
      return { kind: "agenda", items: await listTodayAgenda() };

    case "consolidado.pendencias":
    case "comercial.pendencias":
      return { kind: "pending-items", items: await listLeadPendingItems() };

    case "comercial.vencimentos":
      return { kind: "deadline-list", items: await listCommercialDeadlines() };

    default:
      return WIDGET_DATA[dataKey];
  }
}
