import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Handshake,
  Factory,
  ShoppingCart,
  Boxes,
  Truck,
  Wallet,
  BookUser,
  BarChart3,
  ShieldCheck,
  Users,
  Building2,
  IdCard,
  KeyRound,
  History,
  Inbox,
  UserCheck,
  Timer,
  CalendarClock,
} from "lucide-react";

/**
 * Estrutura de navegação oficial da plataforma.
 * Fonte: docs/05_ESTRUTURA_DOS_MODULOS.md — item 4 (Organização Visual do Sistema).
 *
 * `available: false` indica módulo previsto no ROADMAP porém ainda não
 * implementado. A rota existe e exibe a página padrão de módulo indisponível.
 */
export interface NavigationItem {
  /** Slug utilizado na rota /:module */
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
  /** Sprint/Fase prevista no ROADMAP */
  phase: string;
  /** Caminho completo (usado por itens de submenu). */
  path?: string;
  /** Submenus do módulo. */
  children?: NavigationItem[];
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    label: "Visão Geral",
    items: [
      {
        slug: "dashboard",
        label: "Dashboard",
        description: "Centro de controle da empresa",
        icon: LayoutDashboard,
        available: true,
        phase: "Fase 1",
      },
    ],
  },
  {
    label: "Operação",
    items: [
      {
        slug: "comercial",
        label: "Comercial",
        description: "Leads, propostas e pedidos",
        icon: Handshake,
        available: true,
        phase: "Fase 2 · Sprint 03",
        path: "/comercial",
        children: [
          {
            slug: "leads",
            label: "Leads disponíveis",
            description: "Fila pública de oportunidades sem responsável",
            icon: Inbox,
            available: true,
            phase: "Fase 2 · Sprint 03",
            path: "/comercial/leads",
          },
          {
            slug: "meus-leads",
            label: "Meus Leads",
            description: "Carteira do vendedor e prazos de atendimento",
            icon: UserCheck,
            available: true,
            phase: "Fase 2 · Sprint 03",
            path: "/comercial/leads/meus",
          },
          {
            slug: "aprovacoes",
            label: "Aprovações",
            description: "Solicitações aguardando decisão do gestor",
            icon: Timer,
            available: true,
            phase: "Fase 2 · Sprint 03",
            path: "/comercial/leads/aprovacoes",
          },
          {
            slug: "agenda",
            label: "Agenda comercial",
            description: "Primeiros contatos e retornos agendados",
            icon: CalendarClock,
            available: true,
            phase: "Fase 2 · Sprint 03",
            path: "/comercial/agenda",
          },
        ],
      },
      {
        slug: "producao",
        label: "Produção",
        description: "Ordens de produção e apontamentos",
        icon: Factory,
        available: false,
        phase: "Fase 3",
      },
      {
        slug: "compras",
        label: "Compras",
        description: "Requisições, cotações e pedidos de compra",
        icon: ShoppingCart,
        available: false,
        phase: "Fase 4",
      },
      {
        slug: "estoque",
        label: "Estoque",
        description: "Entradas, saídas e inventário",
        icon: Boxes,
        available: false,
        phase: "Fase 4",
      },
      {
        slug: "logistica",
        label: "Logística",
        description: "Expedição, transporte e instalação",
        icon: Truck,
        available: false,
        phase: "Fase 4",
      },
      {
        slug: "financeiro",
        label: "Financeiro",
        description: "Contas a pagar, a receber e fluxo de caixa",
        icon: Wallet,
        available: false,
        phase: "Fase 5",
      },
    ],
  },
  {
    label: "Gestão",
    items: [
      {
        slug: "cadastros",
        label: "Cadastros",
        description: "Clientes, fornecedores e produtos",
        icon: BookUser,
        available: false,
        phase: "Fase 2",
      },
      {
        slug: "relatorios",
        label: "Relatórios",
        description: "Indicadores, exportações e análises",
        icon: BarChart3,
        available: false,
        phase: "Fase 6",
      },
      {
        slug: "administracao",
        label: "Administração",
        description: "Usuários, grupos, perfis, permissões e auditoria",
        icon: ShieldCheck,
        available: true,
        phase: "Fase 1 · Sprint 02",
        path: "/administracao",
        children: [
          {
            slug: "usuarios",
            label: "Usuários",
            description: "Cadastro e situação dos usuários da Intranet",
            icon: Users,
            available: true,
            phase: "Fase 1 · Sprint 02",
            path: "/administracao/usuarios",
          },
          {
            slug: "grupos",
            label: "Grupos",
            description: "Setores da empresa e módulos liberados",
            icon: Building2,
            available: true,
            phase: "Fase 1 · Sprint 02",
            path: "/administracao/grupos",
          },
          {
            slug: "perfis",
            label: "Perfis",
            description: "Funções exercidas dentro de cada grupo",
            icon: IdCard,
            available: true,
            phase: "Fase 1 · Sprint 02",
            path: "/administracao/perfis",
          },
          {
            slug: "permissoes",
            label: "Permissões",
            description: "Permissões gerais e especiais por módulo",
            icon: KeyRound,
            available: true,
            phase: "Fase 1 · Sprint 02",
            path: "/administracao/permissoes",
          },
          {
            slug: "auditoria",
            label: "Auditoria",
            description: "Trilha imutável de eventos da plataforma",
            icon: History,
            available: true,
            phase: "Fase 1 · Sprint 02",
            path: "/administracao/auditoria",
          },
        ],
      },
    ],
  },
];

export const NAVIGATION_ITEMS: NavigationItem[] = NAVIGATION_GROUPS.flatMap(
  (group) => group.items,
);

/** Todos os itens, incluindo submenus. */
export const ALL_NAVIGATION_ITEMS: NavigationItem[] = NAVIGATION_ITEMS.flatMap((item) => [
  item,
  ...(item.children ?? []),
]);

export function findNavigationItem(slug: string): NavigationItem | undefined {
  return ALL_NAVIGATION_ITEMS.find((item) => item.slug === slug);
}
