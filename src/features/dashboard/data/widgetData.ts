/**
 * Catálogo de dados dos Widgets.
 *
 * Separação exigida na arquitetura: configuração (quem vê o quê),
 * dados (o que é exibido) e apresentação (componentes) são independentes.
 *
 * Sprint 03.1: todos os dados fictícios foram removidos. Os indicadores
 * aparecem zerados e as listagens vazias, mantendo o mesmo contrato de
 * dados por Widget. Na Sprint de backend este catálogo será substituído por
 * consultas reais, preservando exatamente este contrato.
 */

export interface KpiItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: { direction: "up" | "down" | "neutral"; value: string };
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "comercial" | "producao" | "compras" | "financeiro" | "administracao";
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  detail: string;
}

export interface PendingItem {
  id: string;
  title: string;
  owner: string;
  priority: "alta" | "média" | "baixa";
  due: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  variant: "info" | "warning" | "success";
}

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface ChartData {
  type: "line" | "bar";
  xKey: string;
  rows: Record<string, string | number>[];
  series: ChartSeries[];
}

export type StatusTone = "neutral" | "success" | "warning" | "danger";

export interface StatusSummaryItem {
  id: string;
  label: string;
  value: string;
  tone: StatusTone;
}

export interface DeadlineItem {
  id: string;
  title: string;
  detail: string;
  date: string;
  tone: StatusTone;
}

export type WidgetData =
  | { kind: "kpi-group"; items: KpiItem[] }
  | { kind: "chart"; chart: ChartData }
  | { kind: "activity-list"; items: ActivityItem[] }
  | { kind: "agenda"; items: AgendaItem[] }
  | { kind: "pending-items"; items: PendingItem[] }
  | { kind: "quick-actions"; slugs: string[] }
  | { kind: "notices"; items: NoticeItem[] }
  | { kind: "status-summary"; items: StatusSummaryItem[] }
  | { kind: "deadline-list"; items: DeadlineItem[] };

/** Tendência neutra exibida enquanto não há dados reais. */
const NO_TREND = { direction: "neutral", value: "—" } as const;

/** Série temporal zerada (últimos 6 meses) para os gráficos de linha. */
const ZERO_MONTHS = ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];

function zeroedLineRows(keys: string[]): Record<string, string | number>[] {
  return ZERO_MONTHS.map((month) =>
    Object.fromEntries([["month", month], ...keys.map((key) => [key, 0])]),
  );
}

/** Escala zerada do funil de produção para os gráficos de barra. */
const ZERO_PRODUCTION_ROWS = [
  { status: "Planejadas", quantidade: 0 },
  { status: "Em produção", quantidade: 0 },
  { status: "Em acabamento", quantidade: 0 },
  { status: "Concluídas", quantidade: 0 },
];

export const WIDGET_DATA: Record<string, WidgetData> = {
  /* ---------------------------------------------------------- consolidado */
  "consolidado.kpisComerciais": {
    kind: "kpi-group",
    items: [
      {
        id: "leads",
        label: "Leads no mês",
        value: "0",
        helper: "vs. mês anterior",
        trend: NO_TREND,
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
        value: "0%",
        helper: "média trimestral",
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
  },
  "consolidado.kpisOperacionais": {
    kind: "kpi-group",
    items: [
      {
        id: "op",
        label: "Ordens em produção",
        value: "0",
        helper: "nenhuma em atraso",
        trend: NO_TREND,
      },
      {
        id: "compras",
        label: "Compras pendentes",
        value: "0",
        helper: "aguardando cotação",
        trend: NO_TREND,
      },
      {
        id: "expedicao",
        label: "Expedições da semana",
        value: "0",
        helper: "nenhuma instalação agendada",
        trend: NO_TREND,
      },
      {
        id: "financeiro",
        label: "A receber (30 dias)",
        value: "R$ 0",
        helper: "nenhum título vencendo",
        trend: NO_TREND,
      },
    ],
  },
  "consolidado.vendas": {
    kind: "chart",
    chart: {
      type: "line",
      xKey: "month",
      rows: zeroedLineRows(["propostas", "pedidos"]),
      series: [
        { key: "propostas", label: "Propostas", color: "var(--chart-2)" },
        { key: "pedidos", label: "Pedidos", color: "var(--chart-1)" },
      ],
    },
  },
  "consolidado.producao": {
    kind: "chart",
    chart: {
      type: "bar",
      xKey: "status",
      rows: ZERO_PRODUCTION_ROWS,
      series: [{ key: "quantidade", label: "Ordens", color: "var(--chart-1)" }],
    },
  },
  "consolidado.atividades": { kind: "activity-list", items: [] },
  "consolidado.pendencias": { kind: "pending-items", items: [] },
  "consolidado.agenda": { kind: "agenda", items: [] },
  "consolidado.atalhos": {
    kind: "quick-actions",
    slugs: ["comercial", "producao", "compras", "financeiro"],
  },
  "consolidado.avisos": { kind: "notices", items: [] },

  /* ------------------------------------------------------------ comercial */
  "comercial.kpis": {
    kind: "kpi-group",
    items: [
      { id: "c-leads", label: "Leads recebidos", value: "0", helper: "no mês", trend: NO_TREND },
      {
        id: "c-contatos",
        label: "Contatos agendados",
        value: "0",
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
        value: "0%",
        helper: "média trimestral",
        trend: NO_TREND,
      },
    ],
  },
  "comercial.funil": {
    kind: "chart",
    chart: {
      type: "line",
      xKey: "month",
      rows: zeroedLineRows(["propostas", "pedidos"]),
      series: [
        { key: "propostas", label: "Propostas", color: "var(--chart-2)" },
        { key: "pedidos", label: "Pedidos", color: "var(--chart-1)" },
      ],
    },
  },
  "comercial.vencimentos": { kind: "deadline-list", items: [] },
  "comercial.agenda": { kind: "agenda", items: [] },
  "comercial.atividades": { kind: "activity-list", items: [] },
  "comercial.pendencias": { kind: "pending-items", items: [] },

  /* ----------------------------------------------------------- financeiro */
  "financeiro.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "f-entradas",
        label: "Entradas do mês",
        value: "R$ 0",
        helper: "recebimentos confirmados",
        trend: NO_TREND,
      },
      {
        id: "f-saidas",
        label: "Saídas do mês",
        value: "R$ 0",
        helper: "pagamentos efetuados",
        trend: NO_TREND,
      },
      {
        id: "f-receber",
        label: "Contas a receber",
        value: "R$ 0",
        helper: "próximos 30 dias",
        trend: NO_TREND,
      },
      {
        id: "f-pagar",
        label: "Contas a pagar",
        value: "R$ 0",
        helper: "próximos 30 dias",
        trend: NO_TREND,
      },
    ],
  },
  "financeiro.fluxo": {
    kind: "chart",
    chart: {
      type: "line",
      xKey: "month",
      rows: zeroedLineRows(["entradas", "saidas"]),
      series: [
        { key: "entradas", label: "Entradas (R$ mil)", color: "var(--chart-1)" },
        { key: "saidas", label: "Saídas (R$ mil)", color: "var(--chart-3)" },
      ],
    },
  },
  "financeiro.resumo": {
    kind: "status-summary",
    items: [
      { id: "fs1", label: "Títulos vencendo (7 dias)", value: "0", tone: "neutral" },
      { id: "fs2", label: "Títulos vencidos", value: "0", tone: "neutral" },
      { id: "fs3", label: "Recebimentos pendentes", value: "0", tone: "neutral" },
      { id: "fs4", label: "Baixas confirmadas no mês", value: "0", tone: "neutral" },
    ],
  },
  "financeiro.vencimentos": { kind: "deadline-list", items: [] },
  "financeiro.pendencias": { kind: "pending-items", items: [] },
  "financeiro.atividades": { kind: "activity-list", items: [] },

  /* -------------------------------------------------------------- produção */
  "producao.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "p-aguardando",
        label: "Ordens aguardando",
        value: "0",
        helper: "liberação de material",
        trend: NO_TREND,
      },
      {
        id: "p-planejamento",
        label: "Em planejamento",
        value: "0",
        helper: "sequenciamento da semana",
        trend: NO_TREND,
      },
      {
        id: "p-producao",
        label: "Em produção",
        value: "0",
        helper: "nenhuma em atraso",
        trend: NO_TREND,
      },
      {
        id: "p-concluidas",
        label: "Concluídas no mês",
        value: "0",
        helper: "no mês",
        trend: NO_TREND,
      },
    ],
  },
  "producao.status": {
    kind: "chart",
    chart: {
      type: "bar",
      xKey: "status",
      rows: ZERO_PRODUCTION_ROWS,
      series: [{ key: "quantidade", label: "Ordens", color: "var(--chart-1)" }],
    },
  },
  "producao.resumo": {
    kind: "status-summary",
    items: [
      { id: "ps1", label: "Ordens atrasadas", value: "0", tone: "neutral" },
      { id: "ps2", label: "Ordens críticas da semana", value: "0", tone: "neutral" },
      { id: "ps3", label: "Ordens no prazo", value: "0", tone: "neutral" },
    ],
  },
  "producao.prioridades": { kind: "deadline-list", items: [] },
  "producao.agenda": { kind: "agenda", items: [] },
  "producao.pendencias": { kind: "pending-items", items: [] },
  "producao.atividades": { kind: "activity-list", items: [] },

  /* --------------------------------------------------------------- compras */
  "compras.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "co-solicitacoes",
        label: "Solicitações abertas",
        value: "0",
        helper: "aguardando tratamento",
        trend: NO_TREND,
      },
      {
        id: "co-cotacoes",
        label: "Cotações pendentes",
        value: "0",
        helper: "sem retorno de fornecedor",
        trend: NO_TREND,
      },
      {
        id: "co-aprovacao",
        label: "Aguardando aprovação",
        value: "0",
        helper: "no mês",
        trend: NO_TREND,
      },
      {
        id: "co-recebimento",
        label: "Aguardando recebimento",
        value: "0",
        helper: "nenhum atrasado",
        trend: NO_TREND,
      },
    ],
  },
  "compras.resumo": {
    kind: "status-summary",
    items: [
      { id: "cs1", label: "Compras atrasadas", value: "0", tone: "neutral" },
      { id: "cs2", label: "Cotações vencendo hoje", value: "0", tone: "neutral" },
      { id: "cs3", label: "Pedidos confirmados no mês", value: "0", tone: "neutral" },
    ],
  },
  "compras.recebimentos": { kind: "deadline-list", items: [] },
  "compras.pendencias": { kind: "pending-items", items: [] },
  "compras.atividades": { kind: "activity-list", items: [] },

  /* ------------------------------------------------------------- logística */
  "logistica.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "l-expedicoes",
        label: "Expedições da semana",
        value: "0",
        helper: "nenhuma instalação agendada",
        trend: NO_TREND,
      },
      {
        id: "l-transito",
        label: "Cargas em trânsito",
        value: "0",
        helper: "nenhuma entrega prevista",
        trend: NO_TREND,
      },
      {
        id: "l-instalacoes",
        label: "Instalações previstas",
        value: "0",
        helper: "equipes alocadas",
        trend: NO_TREND,
      },
    ],
  },
  "logistica.agenda": { kind: "agenda", items: [] },
  "logistica.pendencias": { kind: "pending-items", items: [] },

  /* ------------------------------------------------------------ engenharia */
  "engenharia.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "e-projetos",
        label: "Projetos em andamento",
        value: "0",
        helper: "aguardando aprovação",
        trend: NO_TREND,
      },
      {
        id: "e-revisoes",
        label: "Revisões técnicas",
        value: "0",
        helper: "no mês",
        trend: NO_TREND,
      },
      {
        id: "e-fichas",
        label: "Fichas técnicas pendentes",
        value: "0",
        helper: "itens de produção",
        trend: NO_TREND,
      },
    ],
  },
  "engenharia.pendencias": { kind: "pending-items", items: [] },
  "engenharia.atividades": { kind: "activity-list", items: [] },
};

export function getWidgetData(dataKey: string): WidgetData | undefined {
  return WIDGET_DATA[dataKey];
}
