import type { AccessGroup, AccessGroupCode, ModuleAction } from "../types";

const FULL: Record<ModuleAction, boolean> = {
  visualizar: true,
  criar: true,
  editar: true,
  excluir: true,
  aprovar: true,
  cancelar: true,
  exportar: true,
  importar: true,
  imprimir: true,
  administrar: true,
  arquivos: true,
};

const READ_ONLY: Record<string, boolean> = {
  visualizar: true,
  exportar: true,
  imprimir: true,
};

const ALL_MODULES = [
  "dashboard",
  "comercial",
  "producao",
  "compras",
  "estoque",
  "logistica",
  "financeiro",
  "cadastros",
  "relatorios",
  "administracao",
];

function permissionsFor(modules: string[], template: Record<string, boolean>) {
  return Object.fromEntries(modules.map((slug) => [slug, template]));
}

/**
 * Configuração simulada dos Grupos de Acesso.
 * Futuramente será administrada pela tela de Permissões (Sprint futura),
 * sem necessidade de alteração de código.
 */
export const ACCESS_GROUPS: Record<AccessGroupCode, AccessGroup> = {
  administracao: {
    code: "administracao",
    label: "Administração",
    description: "Visão consolidada da empresa e configuração da plataforma",
    modules: ALL_MODULES,
    permissions: permissionsFor(ALL_MODULES, FULL),
  },
  diretoria: {
    code: "diretoria",
    label: "Diretoria",
    description: "Visão consolidada e acompanhamento estratégico",
    modules: ALL_MODULES.filter((slug) => slug !== "administracao"),
    permissions: permissionsFor(
      ALL_MODULES.filter((slug) => slug !== "administracao"),
      { ...READ_ONLY, aprovar: true },
    ),
  },
  comercial: {
    code: "comercial",
    label: "Comercial",
    description: "Leads, propostas, pedidos e carteira de clientes",
    modules: ["dashboard", "comercial", "cadastros"],
    permissions: {
      dashboard: READ_ONLY,
      comercial: { ...FULL, excluir: false, aprovar: false },
      cadastros: { visualizar: true, criar: true, editar: true },
    },
  },
  financeiro: {
    code: "financeiro",
    label: "Financeiro",
    description: "Contas a pagar, a receber e fluxo de caixa",
    modules: ["dashboard", "financeiro", "cadastros"],
    permissions: {
      dashboard: READ_ONLY,
      financeiro: { ...FULL, excluir: false },
      cadastros: READ_ONLY,
    },
  },
  producao: {
    code: "producao",
    label: "Produção",
    description: "Ordens de produção, prioridades e apontamentos",
    modules: ["dashboard", "producao", "estoque"],
    permissions: {
      dashboard: READ_ONLY,
      producao: { ...FULL, excluir: false },
      estoque: READ_ONLY,
    },
  },
  compras: {
    code: "compras",
    label: "Compras",
    description: "Solicitações, cotações e pedidos de compra",
    modules: ["dashboard", "compras", "estoque", "cadastros"],
    permissions: {
      dashboard: READ_ONLY,
      compras: { ...FULL, excluir: false, aprovar: false },
      estoque: READ_ONLY,
      cadastros: READ_ONLY,
    },
  },
  logistica: {
    code: "logistica",
    label: "Logística",
    description: "Expedição, transporte e instalação",
    modules: ["dashboard", "logistica", "estoque"],
    permissions: {
      dashboard: READ_ONLY,
      logistica: { ...FULL, excluir: false },
      estoque: READ_ONLY,
    },
  },
  engenharia: {
    code: "engenharia",
    label: "Engenharia",
    description: "Projetos técnicos, fichas e revisões",
    modules: ["dashboard", "producao", "cadastros"],
    permissions: {
      dashboard: READ_ONLY,
      producao: READ_ONLY,
      cadastros: { visualizar: true, criar: true, editar: true },
    },
  },
};

export const ACCESS_GROUP_LIST: AccessGroup[] = Object.values(ACCESS_GROUPS);

export const DEFAULT_ACCESS_GROUP: AccessGroupCode = "administracao";

export function getAccessGroup(code: AccessGroupCode): AccessGroup {
  return ACCESS_GROUPS[code] ?? ACCESS_GROUPS[DEFAULT_ACCESS_GROUP];
}

/** Verificação de módulo liberado — camada visual; o backend validará futuramente. */
export function isModuleAllowed(group: AccessGroup, moduleSlug: string | null): boolean {
  if (!moduleSlug) return true;
  return group.modules.includes(moduleSlug);
}
