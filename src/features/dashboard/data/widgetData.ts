import type {
  ActivityMock,
  AgendaMock,
  KpiMock,
  NoticeMock,
  PendingMock,
} from "./mockDashboard";
import {
  COMMERCIAL_KPIS,
  NOTICES,
  OPERATIONAL_KPIS,
  PENDING_TASKS,
  PRODUCTION_STATUS,
  RECENT_ACTIVITIES,
  SALES_FUNNEL,
  TODAY_AGENDA,
} from "./mockDashboard";

/**
 * Catálogo de dados simulados dos Widgets.
 *
 * Separação exigida na arquitetura: configuração (quem vê o quê),
 * dados (o que é exibido) e apresentação (componentes) são independentes.
 * Na Sprint 02 este catálogo será substituído por consultas reais,
 * mantendo o mesmo contrato de dados por Widget.
 */

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
  | { kind: "kpi-group"; items: KpiMock[] }
  | { kind: "chart"; chart: ChartData }
  | { kind: "activity-list"; items: ActivityMock[] }
  | { kind: "agenda"; items: AgendaMock[] }
  | { kind: "pending-items"; items: PendingMock[] }
  | { kind: "quick-actions"; slugs: string[] }
  | { kind: "notices"; items: NoticeMock[] }
  | { kind: "status-summary"; items: StatusSummaryItem[] }
  | { kind: "deadline-list"; items: DeadlineItem[] };

export const WIDGET_DATA: Record<string, WidgetData> = {
  /* ---------------------------------------------------------- consolidado */
  "consolidado.kpisComerciais": { kind: "kpi-group", items: COMMERCIAL_KPIS },
  "consolidado.kpisOperacionais": { kind: "kpi-group", items: OPERATIONAL_KPIS },
  "consolidado.vendas": {
    kind: "chart",
    chart: {
      type: "line",
      xKey: "month",
      rows: SALES_FUNNEL,
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
      rows: PRODUCTION_STATUS,
      series: [{ key: "quantidade", label: "Ordens", color: "var(--chart-1)" }],
    },
  },
  "consolidado.atividades": { kind: "activity-list", items: RECENT_ACTIVITIES },
  "consolidado.pendencias": { kind: "pending-items", items: PENDING_TASKS },
  "consolidado.agenda": { kind: "agenda", items: TODAY_AGENDA },
  "consolidado.atalhos": {
    kind: "quick-actions",
    slugs: ["comercial", "producao", "compras", "financeiro"],
  },
  "consolidado.avisos": { kind: "notices", items: NOTICES },

  /* ------------------------------------------------------------ comercial */
  "comercial.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "c-leads",
        label: "Leads recebidos",
        value: "48",
        helper: "no mês",
        trend: { direction: "up", value: "+12%" },
      },
      {
        id: "c-contatos",
        label: "Contatos agendados",
        value: "11",
        helper: "próximos 7 dias",
        trend: { direction: "up", value: "+3" },
      },
      {
        id: "c-propostas",
        label: "Propostas em aberto",
        value: "23",
        helper: "R$ 1,8 mi em negociação",
        trend: { direction: "up", value: "+5%" },
      },
      {
        id: "c-conversao",
        label: "Taxa de conversão",
        value: "31%",
        helper: "média trimestral",
        trend: { direction: "neutral", value: "estável" },
      },
    ],
  },
  "comercial.funil": {
    kind: "chart",
    chart: {
      type: "line",
      xKey: "month",
      rows: SALES_FUNNEL,
      series: [
        { key: "propostas", label: "Propostas", color: "var(--chart-2)" },
        { key: "pedidos", label: "Pedidos", color: "var(--chart-1)" },
      ],
    },
  },
  "comercial.vencimentos": {
    kind: "deadline-list",
    items: [
      {
        id: "cv1",
        title: "PRP-2026-0179 · Laboratório Vidalis",
        detail: "Validade da proposta",
        date: "vence hoje",
        tone: "danger",
      },
      {
        id: "cv2",
        title: "PRP-2026-0181 · Instituto Verde",
        detail: "Aguardando retorno do cliente",
        date: "em 2 dias",
        tone: "warning",
      },
      {
        id: "cv3",
        title: "PRP-2026-0184 · Clínica Aurora",
        detail: "Revisão 01 enviada",
        date: "em 6 dias",
        tone: "neutral",
      },
    ],
  },
  "comercial.agenda": {
    kind: "agenda",
    items: [
      {
        id: "ca1",
        time: "09:00",
        title: "Reunião comercial semanal",
        detail: "Sala de reuniões · 6 participantes",
      },
      {
        id: "ca2",
        time: "11:30",
        title: "Visita técnica — Laboratório Vidalis",
        detail: "Levantamento de medidas",
      },
      {
        id: "ca3",
        time: "15:00",
        title: "Follow-up PRP-2026-0181",
        detail: "Contato com Instituto Verde",
      },
    ],
  },
  "comercial.atividades": {
    kind: "activity-list",
    items: RECENT_ACTIVITIES.filter((item) => item.type === "comercial"),
  },
  "comercial.pendencias": {
    kind: "pending-items",
    items: [
      {
        id: "cp1",
        title: "Enviar revisão da proposta PRP-2026-0179",
        owner: "Carteira comercial",
        priority: "alta",
        due: "hoje",
      },
      {
        id: "cp2",
        title: "Registrar retorno do lead LED-2026-0233",
        owner: "Pré-venda",
        priority: "média",
        due: "amanhã",
      },
    ],
  },

  /* ----------------------------------------------------------- financeiro */
  "financeiro.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "f-entradas",
        label: "Entradas do mês",
        value: "R$ 1,24 mi",
        helper: "recebimentos confirmados",
        trend: { direction: "up", value: "+9%" },
      },
      {
        id: "f-saidas",
        label: "Saídas do mês",
        value: "R$ 868 mil",
        helper: "pagamentos efetuados",
        trend: { direction: "down", value: "-4%" },
      },
      {
        id: "f-receber",
        label: "Contas a receber",
        value: "R$ 742 mil",
        helper: "próximos 30 dias",
        trend: { direction: "up", value: "+6%" },
      },
      {
        id: "f-pagar",
        label: "Contas a pagar",
        value: "R$ 511 mil",
        helper: "próximos 30 dias",
        trend: { direction: "neutral", value: "estável" },
      },
    ],
  },
  "financeiro.fluxo": {
    kind: "chart",
    chart: {
      type: "line",
      xKey: "month",
      rows: [
        { month: "Fev", entradas: 940, saidas: 720 },
        { month: "Mar", entradas: 1080, saidas: 810 },
        { month: "Abr", entradas: 990, saidas: 760 },
        { month: "Mai", entradas: 1150, saidas: 880 },
        { month: "Jun", entradas: 1210, saidas: 845 },
        { month: "Jul", entradas: 1240, saidas: 868 },
      ],
      series: [
        { key: "entradas", label: "Entradas (R$ mil)", color: "var(--chart-1)" },
        { key: "saidas", label: "Saídas (R$ mil)", color: "var(--chart-3)" },
      ],
    },
  },
  "financeiro.resumo": {
    kind: "status-summary",
    items: [
      { id: "fs1", label: "Títulos vencendo (7 dias)", value: "9", tone: "warning" },
      { id: "fs2", label: "Títulos vencidos", value: "3", tone: "danger" },
      { id: "fs3", label: "Recebimentos pendentes", value: "12", tone: "neutral" },
      { id: "fs4", label: "Baixas confirmadas no mês", value: "38", tone: "success" },
    ],
  },
  "financeiro.vencimentos": {
    kind: "deadline-list",
    items: [
      {
        id: "fv1",
        title: "REC-2026-0453 · Laboratório Vidalis",
        detail: "R$ 84.500,00",
        date: "vencido há 2 dias",
        tone: "danger",
      },
      {
        id: "fv2",
        title: "PAG-2026-0188 · Fornecedor Inox Sul",
        detail: "R$ 32.900,00",
        date: "vence hoje",
        tone: "warning",
      },
      {
        id: "fv3",
        title: "REC-2026-0461 · Instituto Verde",
        detail: "R$ 126.000,00",
        date: "em 5 dias",
        tone: "neutral",
      },
    ],
  },
  "financeiro.pendencias": {
    kind: "pending-items",
    items: [
      {
        id: "fp1",
        title: "Conciliar extrato bancário da semana",
        owner: "Financeiro",
        priority: "alta",
        due: "hoje",
      },
      {
        id: "fp2",
        title: "Emitir nota fiscal do pedido PED-2026-0122",
        owner: "Faturamento",
        priority: "média",
        due: "amanhã",
      },
    ],
  },
  "financeiro.atividades": {
    kind: "activity-list",
    items: RECENT_ACTIVITIES.filter((item) => item.type === "financeiro"),
  },

  /* -------------------------------------------------------------- produção */
  "producao.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "p-aguardando",
        label: "Ordens aguardando",
        value: "5",
        helper: "liberação de material",
        trend: { direction: "neutral", value: "estável" },
      },
      {
        id: "p-planejamento",
        label: "Em planejamento",
        value: "8",
        helper: "sequenciamento da semana",
        trend: { direction: "up", value: "+2" },
      },
      {
        id: "p-producao",
        label: "Em produção",
        value: "19",
        helper: "3 em atraso",
        trend: { direction: "down", value: "-2" },
      },
      {
        id: "p-concluidas",
        label: "Concluídas no mês",
        value: "22",
        helper: "meta 25",
        trend: { direction: "up", value: "+4" },
      },
    ],
  },
  "producao.status": {
    kind: "chart",
    chart: {
      type: "bar",
      xKey: "status",
      rows: PRODUCTION_STATUS,
      series: [{ key: "quantidade", label: "Ordens", color: "var(--chart-1)" }],
    },
  },
  "producao.resumo": {
    kind: "status-summary",
    items: [
      { id: "ps1", label: "Ordens atrasadas", value: "3", tone: "danger" },
      { id: "ps2", label: "Ordens críticas da semana", value: "6", tone: "warning" },
      { id: "ps3", label: "Ordens no prazo", value: "16", tone: "success" },
    ],
  },
  "producao.prioridades": {
    kind: "deadline-list",
    items: [
      {
        id: "pp1",
        title: "OP-2026-0091 · Bancadas em epóxi",
        detail: "Setor de marcenaria",
        date: "entrega em 2 dias",
        tone: "danger",
      },
      {
        id: "pp2",
        title: "OP-2026-0093 · Capelas de exaustão",
        detail: "Setor de metalurgia",
        date: "entrega em 5 dias",
        tone: "warning",
      },
      {
        id: "pp3",
        title: "OP-2026-0097 · Armários técnicos",
        detail: "Acabamento",
        date: "entrega em 9 dias",
        tone: "neutral",
      },
    ],
  },
  "producao.agenda": {
    kind: "agenda",
    items: [
      {
        id: "pa1",
        time: "07:30",
        title: "Abertura de turno",
        detail: "Distribuição das ordens do dia",
      },
      {
        id: "pa2",
        time: "14:00",
        title: "Alinhamento de produção",
        detail: "OP-2026-0091 e OP-2026-0093",
      },
      {
        id: "pa3",
        time: "16:00",
        title: "Inspeção de qualidade",
        detail: "Lote de bancadas",
      },
    ],
  },
  "producao.pendencias": {
    kind: "pending-items",
    items: [
      {
        id: "pq1",
        title: "Apontar horas da OP-2026-0091",
        owner: "Supervisão",
        priority: "alta",
        due: "hoje",
      },
      {
        id: "pq2",
        title: "Solicitar material complementar da OP-2026-0093",
        owner: "PCP",
        priority: "média",
        due: "amanhã",
      },
    ],
  },
  "producao.atividades": {
    kind: "activity-list",
    items: RECENT_ACTIVITIES.filter((item) => item.type === "producao"),
  },

  /* --------------------------------------------------------------- compras */
  "compras.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "co-solicitacoes",
        label: "Solicitações abertas",
        value: "12",
        helper: "aguardando tratamento",
        trend: { direction: "up", value: "+4" },
      },
      {
        id: "co-cotacoes",
        label: "Cotações pendentes",
        value: "7",
        helper: "2 sem retorno de fornecedor",
        trend: { direction: "neutral", value: "estável" },
      },
      {
        id: "co-aprovacao",
        label: "Aguardando aprovação",
        value: "4",
        helper: "R$ 218 mil",
        trend: { direction: "up", value: "+1" },
      },
      {
        id: "co-recebimento",
        label: "Aguardando recebimento",
        value: "9",
        helper: "2 atrasados",
        trend: { direction: "down", value: "-1" },
      },
    ],
  },
  "compras.resumo": {
    kind: "status-summary",
    items: [
      { id: "cs1", label: "Compras atrasadas", value: "2", tone: "danger" },
      { id: "cs2", label: "Cotações vencendo hoje", value: "3", tone: "warning" },
      { id: "cs3", label: "Pedidos confirmados no mês", value: "27", tone: "success" },
    ],
  },
  "compras.recebimentos": {
    kind: "deadline-list",
    items: [
      {
        id: "cr1",
        title: "COM-2026-0041 · Chapas de inox",
        detail: "Fornecedor Inox Sul",
        date: "atrasado há 3 dias",
        tone: "danger",
      },
      {
        id: "cr2",
        title: "COM-2026-0044 · Resina epóxi",
        detail: "Fornecedor Quimilab",
        date: "previsto para hoje",
        tone: "warning",
      },
      {
        id: "cr3",
        title: "COM-2026-0047 · Ferragens técnicas",
        detail: "Fornecedor Metalfix",
        date: "em 4 dias",
        tone: "neutral",
      },
    ],
  },
  "compras.pendencias": {
    kind: "pending-items",
    items: [
      {
        id: "cq1",
        title: "Liberar pedido de compra COM-2026-0044",
        owner: "Suprimentos",
        priority: "alta",
        due: "hoje",
      },
      {
        id: "cq2",
        title: "Cobrar cotação do fornecedor Metalfix",
        owner: "Suprimentos",
        priority: "média",
        due: "amanhã",
      },
    ],
  },
  "compras.atividades": {
    kind: "activity-list",
    items: RECENT_ACTIVITIES.filter((item) => item.type === "compras"),
  },

  /* ------------------------------------------------------------- logística */
  "logistica.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "l-expedicoes",
        label: "Expedições da semana",
        value: "9",
        helper: "1 instalação agendada",
        trend: { direction: "up", value: "+3" },
      },
      {
        id: "l-transito",
        label: "Cargas em trânsito",
        value: "4",
        helper: "2 entregas amanhã",
        trend: { direction: "neutral", value: "estável" },
      },
      {
        id: "l-instalacoes",
        label: "Instalações previstas",
        value: "3",
        helper: "equipes alocadas",
        trend: { direction: "up", value: "+1" },
      },
    ],
  },
  "logistica.agenda": {
    kind: "agenda",
    items: [
      {
        id: "la1",
        time: "08:00",
        title: "Carregamento — Pedido PED-2026-0122",
        detail: "Doca 2",
      },
      {
        id: "la2",
        time: "13:30",
        title: "Instalação — Clínica Aurora",
        detail: "Equipe de campo · 3 técnicos",
      },
    ],
  },
  "logistica.pendencias": {
    kind: "pending-items",
    items: [
      {
        id: "lq1",
        title: "Confirmar prazo de instalação — PED-2026-0122",
        owner: "Logística",
        priority: "alta",
        due: "hoje",
      },
      {
        id: "lq2",
        title: "Emitir romaneio da expedição do dia",
        owner: "Expedição",
        priority: "média",
        due: "hoje",
      },
    ],
  },

  /* ------------------------------------------------------------ engenharia */
  "engenharia.kpis": {
    kind: "kpi-group",
    items: [
      {
        id: "e-projetos",
        label: "Projetos em andamento",
        value: "6",
        helper: "2 aguardando aprovação",
        trend: { direction: "up", value: "+1" },
      },
      {
        id: "e-revisoes",
        label: "Revisões técnicas",
        value: "4",
        helper: "no mês",
        trend: { direction: "neutral", value: "estável" },
      },
      {
        id: "e-fichas",
        label: "Fichas técnicas pendentes",
        value: "3",
        helper: "itens de produção",
        trend: { direction: "down", value: "-2" },
      },
    ],
  },
  "engenharia.pendencias": {
    kind: "pending-items",
    items: [
      {
        id: "eq1",
        title: "Revisar ficha técnica de bancada em epóxi",
        owner: "Engenharia",
        priority: "alta",
        due: "hoje",
      },
      {
        id: "eq2",
        title: "Validar detalhamento da capela de exaustão",
        owner: "Engenharia",
        priority: "baixa",
        due: "esta semana",
      },
    ],
  },
  "engenharia.atividades": {
    kind: "activity-list",
    items: RECENT_ACTIVITIES.filter((item) => item.type === "producao"),
  },
};

export function getWidgetData(dataKey: string): WidgetData | undefined {
  return WIDGET_DATA[dataKey];
}
