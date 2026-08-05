import { MASTER_PROFILE_ID, MASTER_SPECIAL_PERMISSIONS } from "@/features/users/data/masterUser";

import type { Profile } from "../types";

/**
 * Perfis estruturais da empresa — cadastro inicial da plataforma.
 *
 * O Perfil Master (PRF-001) é o perfil do Administrador Master, com todas as
 * Permissões Especiais. Os demais Perfis representam as funções previstas de
 * cada Grupo e serão atribuídos conforme os usuários reais forem cadastrados.
 *
 * Sprint 03.1: nenhum dado fictício. Na Sprint de backend estes registros
 * passarão a ser persistidos e administrados pela própria plataforma.
 */
const SETUP_DATE = "2026-08-05T00:00:00.000Z";

export const SEED_PROFILES: Profile[] = [
  {
    id: MASTER_PROFILE_ID,
    name: "Master",
    description:
      "Acesso total à plataforma, incluindo administração de usuários, grupos, perfis e permissões.",
    groupCode: "administracao",
    level: 5,
    active: true,
    createdAt: SETUP_DATE,
    override: {},
    specialPermissions: MASTER_SPECIAL_PERMISSIONS,
  },
  {
    id: "PRF-002",
    name: "Diretor",
    description: "Acompanhamento estratégico e aprovações de alto nível.",
    groupCode: "diretoria",
    level: 5,
    active: true,
    createdAt: SETUP_DATE,
    override: {},
    specialPermissions: ["dados.custos", "dados.confidenciais", "pedido.alterar_aprovado"],
  },
  {
    id: "PRF-003",
    name: "Vendedor",
    description: "Atendimento de leads, elaboração de propostas e pedidos.",
    groupCode: "comercial",
    level: 1,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      revoked: { comercial: { exportar: true, importar: true } },
    },
    specialPermissions: [],
  },
  {
    id: "PRF-004",
    name: "Supervisor Comercial",
    description: "Acompanhamento da equipe e conferência de propostas.",
    groupCode: "comercial",
    level: 3,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      granted: { comercial: { aprovar: true } },
    },
    specialPermissions: ["proposta.aprovar", "proposta.anular_revisao"],
  },
  {
    id: "PRF-005",
    name: "Gerente Comercial",
    description: "Gestão completa da área comercial e conversão de pedidos.",
    groupCode: "comercial",
    level: 4,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      granted: { comercial: { aprovar: true, cancelar: true, excluir: true } },
    },
    specialPermissions: [
      "proposta.aprovar",
      "proposta.cancelar",
      "proposta.converter",
      "pedido.cancelar",
      "dados.custos",
    ],
  },
  {
    id: "PRF-006",
    name: "Analista Financeiro",
    description: "Lançamentos, conciliações e acompanhamento de títulos.",
    groupCode: "financeiro",
    level: 2,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      revoked: { financeiro: { cancelar: true } },
    },
    specialPermissions: [],
  },
  {
    id: "PRF-007",
    name: "Gerente Financeiro",
    description: "Gestão do fluxo de caixa, estornos e documentos financeiros.",
    groupCode: "financeiro",
    level: 4,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      granted: { financeiro: { excluir: true } },
    },
    specialPermissions: [
      "financeiro.alterar_valores",
      "financeiro.estornar",
      "dados.confidenciais",
      "dados.custos",
    ],
  },
  {
    id: "PRF-008",
    name: "Operador de Produção",
    description: "Execução e apontamento das ordens de produção.",
    groupCode: "producao",
    level: 1,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      revoked: { producao: { criar: true, exportar: true } },
    },
    specialPermissions: [],
  },
  {
    id: "PRF-009",
    name: "Supervisor de Produção",
    description: "Prioridades, liberação de ordens e controle do setor.",
    groupCode: "producao",
    level: 3,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      granted: { producao: { aprovar: true } },
    },
    specialPermissions: ["producao.liberar", "producao.reabrir"],
  },
  {
    id: "PRF-010",
    name: "Comprador",
    description: "Solicitações, cotações e acompanhamento de fornecedores.",
    groupCode: "compras",
    level: 2,
    active: true,
    createdAt: SETUP_DATE,
    override: {},
    specialPermissions: [],
  },
  {
    id: "PRF-011",
    name: "Gerente de Compras",
    description: "Aprovação de pedidos de compra e negociação estratégica.",
    groupCode: "compras",
    level: 4,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      granted: { compras: { aprovar: true } },
    },
    specialPermissions: ["compra.aprovar", "dados.custos"],
  },
  {
    id: "PRF-012",
    name: "Analista de Logística",
    description: "Expedição, transporte e acompanhamento de entregas.",
    groupCode: "logistica",
    level: 2,
    active: true,
    createdAt: SETUP_DATE,
    override: {},
    specialPermissions: [],
  },
  {
    id: "PRF-013",
    name: "Projetista",
    description: "Elaboração de projetos técnicos, fichas e revisões.",
    groupCode: "engenharia",
    level: 2,
    active: true,
    createdAt: SETUP_DATE,
    override: {
      granted: { cadastros: { arquivos: true } },
    },
    specialPermissions: [],
  },
  {
    id: "PRF-014",
    name: "Coordenador de Engenharia",
    description: "Validação técnica dos projetos e controle de revisões.",
    groupCode: "engenharia",
    level: 3,
    active: false,
    createdAt: SETUP_DATE,
    override: {
      granted: { producao: { editar: true } },
    },
    specialPermissions: ["arquivos.excluir"],
  },
];
