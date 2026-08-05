import type { AccessGroupCode } from "@/features/access/types";

/** Componentes reutilizáveis disponíveis para os Widgets do Dashboard. */
export type WidgetComponent =
  | "kpi-group"
  | "chart"
  | "activity-list"
  | "agenda"
  | "pending-items"
  | "quick-actions"
  | "notices"
  | "status-summary"
  | "deadline-list"
  /** Widgets do módulo de Leads — consomem o Service oficial (Sprint 03). */
  | "leads-kpis"
  | "leads-agenda";

/**
 * Definição de um Widget dentro da configuração de um Grupo.
 * Futuramente estes registros virão do banco e serão editáveis pelo
 * Administrador (módulos liberados, visibilidade e ordem).
 */
export interface DashboardWidget {
  /** Código único do Widget (usado futuramente pelo Administrador). */
  code: string;
  title?: string;
  description?: string;
  component: WidgetComponent;
  /** Módulo relacionado — Widget oculto quando o módulo não está liberado. */
  module: string | null;
  order: number;
  /** Largura no grid de 3 colunas. */
  span: 1 | 2 | 3;
  visible: boolean;
  /** Chave no catálogo de dados dos Widgets (widgetData.ts). */
  dataKey: string;
}

export interface DashboardConfig {
  group: AccessGroupCode;
  title: string;
  description: string;
  widgets: DashboardWidget[];
}

/**
 * Sobrescrita de um Widget pelo Perfil (Nível 2 da hierarquia de Dashboards).
 * O Perfil nunca cria Widgets novos: apenas ajusta visibilidade, ordem e
 * largura dos Widgets já previstos na configuração do Grupo.
 */
export interface DashboardWidgetOverride {
  code: string;
  visible?: boolean;
  order?: number;
  span?: 1 | 2 | 3;
}

/** Configuração de Dashboard de um Perfil dentro do Grupo. */
export interface DashboardProfileConfig {
  profileId: string;
  title?: string;
  widgets: DashboardWidgetOverride[];
}

