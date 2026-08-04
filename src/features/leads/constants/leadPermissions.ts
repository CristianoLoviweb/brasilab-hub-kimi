/**
 * Permissões específicas do módulo de Leads.
 *
 * Nesta Sprint a autorização utiliza exclusivamente a estrutura simulada
 * construída na Sprint 02 (Grupo → Perfil → Permissões). A validação
 * definitiva ocorrerá SEMPRE no backend
 * (docs/10_SEGURANCA_DA_INFORMACAO.md — a interface é apenas apresentação).
 */
export const LEAD_PERMISSIONS = {
  visualizarDisponiveis: "leads.visualizar_disponiveis",
  visualizarProprios: "leads.visualizar_proprios",
  visualizarTodos: "leads.visualizar_todos",
  criar: "leads.criar",
  editar: "leads.editar",
  solicitar: "leads.solicitar",
  aprovarAtribuicao: "leads.aprovar_atribuicao",
  recusarAtribuicao: "leads.recusar_atribuicao",
  atribuirDiretamente: "leads.atribuir_diretamente",
  transferir: "leads.transferir",
  registrarContato: "leads.registrar_contato",
  agendarContato: "leads.agendar_contato",
  adicionarNota: "leads.adicionar_nota",
  adicionarArquivo: "leads.adicionar_arquivo",
  marcarPerdido: "leads.marcar_perdido",
  descartar: "leads.descartar",
  converterProposta: "leads.converter_proposta",
} as const;

export type LeadPermissionCode = (typeof LEAD_PERMISSIONS)[keyof typeof LEAD_PERMISSIONS];

export const LEAD_PERMISSION_LABELS: Record<LeadPermissionCode, string> = {
  "leads.visualizar_disponiveis": "Visualizar fila de disponíveis",
  "leads.visualizar_proprios": "Visualizar os próprios Leads",
  "leads.visualizar_todos": "Visualizar todos os Leads",
  "leads.criar": "Cadastrar Lead",
  "leads.editar": "Editar Lead",
  "leads.solicitar": "Solicitar Lead",
  "leads.aprovar_atribuicao": "Aprovar atribuição",
  "leads.recusar_atribuicao": "Recusar atribuição",
  "leads.atribuir_diretamente": "Atribuir diretamente",
  "leads.transferir": "Transferir Lead",
  "leads.registrar_contato": "Registrar contato",
  "leads.agendar_contato": "Agendar contato",
  "leads.adicionar_nota": "Adicionar nota interna",
  "leads.adicionar_arquivo": "Adicionar arquivo",
  "leads.marcar_perdido": "Marcar como perdido",
  "leads.descartar": "Descartar Lead",
  "leads.converter_proposta": "Converter em Proposta",
};

/** Conjunto de permissões concedido ao vendedor. */
const SELLER_PERMISSIONS: LeadPermissionCode[] = [
  LEAD_PERMISSIONS.visualizarDisponiveis,
  LEAD_PERMISSIONS.visualizarProprios,
  LEAD_PERMISSIONS.criar,
  LEAD_PERMISSIONS.editar,
  LEAD_PERMISSIONS.solicitar,
  LEAD_PERMISSIONS.registrarContato,
  LEAD_PERMISSIONS.agendarContato,
  LEAD_PERMISSIONS.adicionarNota,
  LEAD_PERMISSIONS.adicionarArquivo,
  LEAD_PERMISSIONS.marcarPerdido,
  LEAD_PERMISSIONS.converterProposta,
];

/** Conjunto adicional concedido ao gestor comercial. */
const MANAGER_PERMISSIONS: LeadPermissionCode[] = [
  ...SELLER_PERMISSIONS,
  LEAD_PERMISSIONS.visualizarTodos,
  LEAD_PERMISSIONS.aprovarAtribuicao,
  LEAD_PERMISSIONS.recusarAtribuicao,
  LEAD_PERMISSIONS.atribuirDiretamente,
  LEAD_PERMISSIONS.transferir,
  LEAD_PERMISSIONS.descartar,
];

/** Somente leitura — Diretoria e demais áreas autorizadas. */
const VIEWER_PERMISSIONS: LeadPermissionCode[] = [
  LEAD_PERMISSIONS.visualizarDisponiveis,
  LEAD_PERMISSIONS.visualizarTodos,
];

export const LEAD_PERMISSION_SETS = {
  seller: SELLER_PERMISSIONS,
  manager: MANAGER_PERMISSIONS,
  viewer: VIEWER_PERMISSIONS,
} as const;
