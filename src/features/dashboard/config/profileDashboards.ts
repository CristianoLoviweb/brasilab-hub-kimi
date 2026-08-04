import type { DashboardProfileConfig } from "../types";

/**
 * Nível 2 — Sobrescrita do Dashboard por Perfil.
 *
 * Hierarquia oficial de resolução do Dashboard:
 *   Nível 1 — Padrão do Grupo (dashboardConfig.ts)
 *   Nível 2 — Sobrescrita do Perfil (este arquivo)
 *   Nível 3 — Preferências do Usuário (Sprint futura)
 *
 * A sobrescrita nunca cria Widgets: apenas oculta, reordena ou redimensiona
 * os Widgets já autorizados ao Grupo.
 *
 * DEVELOPMENT ONLY (dados simulados) — futuramente administrado pela tela de
 * configuração do Dashboard.
 */
export const DASHBOARD_PROFILE_OVERRIDES: Record<string, DashboardProfileConfig> = {
  // Vendedor — foco na carteira, sem visão consolidada da área.
  "PRF-003": {
    profileId: "PRF-003",
    title: "Dashboard do Vendedor",
    widgets: [
      { code: "comercial.pendencias", order: 15, span: 2 },
      { code: "comercial.funil", visible: false },
    ],
  },
  // Supervisor Comercial — prioriza vencimentos das propostas.
  "PRF-004": {
    profileId: "PRF-004",
    title: "Dashboard da Supervisão Comercial",
    widgets: [{ code: "comercial.vencimentos", order: 15, span: 2 }],
  },
  // Analista Financeiro — sem gráfico consolidado de fluxo.
  "PRF-006": {
    profileId: "PRF-006",
    title: "Dashboard do Analista Financeiro",
    widgets: [
      { code: "financeiro.fluxo", visible: false },
      { code: "financeiro.vencimentos", order: 15, span: 3 },
    ],
  },
  // Operador de Produção — apenas execução do dia.
  "PRF-008": {
    profileId: "PRF-008",
    title: "Dashboard do Operador",
    widgets: [
      { code: "producao.status", visible: false },
      { code: "producao.resumo", visible: false },
      { code: "producao.prioridades", order: 15, span: 3 },
    ],
  },
};

export function getDashboardProfileConfig(
  profileId: string | null | undefined,
): DashboardProfileConfig | undefined {
  if (!profileId) return undefined;
  return DASHBOARD_PROFILE_OVERRIDES[profileId];
}
