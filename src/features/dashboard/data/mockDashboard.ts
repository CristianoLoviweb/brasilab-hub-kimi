/**
 * Dados simulados (Mock Data) exclusivos da Sprint 01.
 * Nenhuma informação vem do banco de dados nesta etapa.
 */

export interface KpiMock {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: { direction: "up" | "down" | "neutral"; value: string };
}

export const COMMERCIAL_KPIS: KpiMock[] = [
  {
    id: "leads",
    label: "Leads no mês",
    value: "48",
    helper: "vs. mês anterior",
    trend: { direction: "up", value: "+12%" },
  },
  {
    id: "propostas",
    label: "Propostas em aberto",
    value: "23",
    helper: "R$ 1,8 mi em negociação",
    trend: { direction: "up", value: "+5%" },
  },
  {
    id: "conversao",
    label: "Taxa de conversão",
    value: "31%",
    helper: "média trimestral",
    trend: { direction: "neutral", value: "estável" },
  },
  {
    id: "pedidos",
    label: "Pedidos confirmados",
    value: "14",
    helper: "R$ 964 mil",
    trend: { direction: "up", value: "+8%" },
  },
];

export const OPERATIONAL_KPIS: KpiMock[] = [
  {
    id: "op",
    label: "Ordens em produção",
    value: "19",
    helper: "3 em atraso",
    trend: { direction: "down", value: "-2" },
  },
  {
    id: "compras",
    label: "Compras pendentes",
    value: "7",
    helper: "2 aguardando cotação",
    trend: { direction: "neutral", value: "estável" },
  },
  {
    id: "expedicao",
    label: "Expedições da semana",
    value: "9",
    helper: "1 instalação agendada",
    trend: { direction: "up", value: "+3" },
  },
  {
    id: "financeiro",
    label: "A receber (30 dias)",
    value: "R$ 742 mil",
    helper: "4 títulos vencendo",
    trend: { direction: "up", value: "+6%" },
  },
];

export const SALES_FUNNEL = [
  { month: "Fev", propostas: 28, pedidos: 9 },
  { month: "Mar", propostas: 34, pedidos: 12 },
  { month: "Abr", propostas: 31, pedidos: 11 },
  { month: "Mai", propostas: 39, pedidos: 15 },
  { month: "Jun", propostas: 44, pedidos: 16 },
  { month: "Jul", propostas: 48, pedidos: 14 },
];

export const PRODUCTION_STATUS = [
  { status: "Planejadas", quantidade: 8 },
  { status: "Em produção", quantidade: 19 },
  { status: "Em acabamento", quantidade: 6 },
  { status: "Concluídas", quantidade: 22 },
];

export interface ActivityMock {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "comercial" | "producao" | "compras" | "financeiro";
}

export const RECENT_ACTIVITIES: ActivityMock[] = [
  {
    id: "a1",
    user: "Marina Duarte",
    action: "criou a proposta",
    target: "PRP-2026-0184",
    time: "há 12 min",
    type: "comercial",
  },
  {
    id: "a2",
    user: "Rogério Lima",
    action: "aprovou a ordem de produção",
    target: "OP-2026-0091",
    time: "há 45 min",
    type: "producao",
  },
  {
    id: "a3",
    user: "Camila Prado",
    action: "registrou cotação de compra",
    target: "COT-2026-0037",
    time: "há 2 h",
    type: "compras",
  },
  {
    id: "a4",
    user: "Eduardo Neves",
    action: "baixou o título",
    target: "REC-2026-0453",
    time: "há 3 h",
    type: "financeiro",
  },
  {
    id: "a5",
    user: "Marina Duarte",
    action: "revisou a proposta",
    target: "PRP-2026-0179 · Rev. 02",
    time: "ontem",
    type: "comercial",
  },
];

export interface AgendaMock {
  id: string;
  time: string;
  title: string;
  detail: string;
}

export const TODAY_AGENDA: AgendaMock[] = [
  {
    id: "e1",
    time: "09:00",
    title: "Reunião comercial semanal",
    detail: "Sala de reuniões · 6 participantes",
  },
  {
    id: "e2",
    time: "11:30",
    title: "Visita técnica — Laboratório Vidalis",
    detail: "Levantamento de medidas",
  },
  {
    id: "e3",
    time: "14:00",
    title: "Alinhamento de produção",
    detail: "OP-2026-0091 e OP-2026-0093",
  },
  {
    id: "e4",
    time: "16:30",
    title: "Fechamento financeiro parcial",
    detail: "Conferência de recebíveis",
  },
];

export interface PendingMock {
  id: string;
  title: string;
  owner: string;
  priority: "alta" | "média" | "baixa";
  due: string;
}

export const PENDING_TASKS: PendingMock[] = [
  {
    id: "p1",
    title: "Aprovar revisão da proposta PRP-2026-0179",
    owner: "Diretoria",
    priority: "alta",
    due: "hoje",
  },
  {
    id: "p2",
    title: "Liberar pedido de compra COM-2026-0044",
    owner: "Suprimentos",
    priority: "alta",
    due: "hoje",
  },
  {
    id: "p3",
    title: "Confirmar prazo de instalação — Pedido PED-2026-0122",
    owner: "Logística",
    priority: "média",
    due: "amanhã",
  },
  {
    id: "p4",
    title: "Revisar ficha técnica de bancada em epóxi",
    owner: "Engenharia",
    priority: "baixa",
    due: "esta semana",
  },
];

export interface NoticeMock {
  id: string;
  title: string;
  description: string;
  variant: "info" | "warning" | "success";
}

export const NOTICES: NoticeMock[] = [
  {
    id: "n1",
    title: "Plataforma em construção",
    description:
      "A Sprint 01 entrega a fundação da Intranet. Os módulos de negócio serão liberados nas próximas Sprints.",
    variant: "info",
  },
  {
    id: "n2",
    title: "Inventário de estoque",
    description: "Contagem cíclica programada para a última semana do mês.",
    variant: "warning",
  },
];
