import type { SpecialPermission, SpecialPermissionCode } from "../types";

/**
 * Catálogo oficial das Permissões Especiais.
 * Fonte: docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md — itens 7 e 8.
 *
 * As Permissões Especiais são uma camada adicional: nunca concedem acesso a
 * um módulo ao qual o usuário não possui acesso.
 */
export const SPECIAL_PERMISSIONS: SpecialPermission[] = [
  {
    code: "proposta.aprovar",
    label: "Aprovar proposta",
    description: "Autoriza a aprovação de propostas comerciais.",
    module: "comercial",
  },
  {
    code: "proposta.cancelar",
    label: "Cancelar proposta",
    description: "Autoriza o cancelamento de propostas.",
    module: "comercial",
  },
  {
    code: "proposta.converter",
    label: "Converter proposta em pedido",
    description: "Autoriza a formalização da venda a partir da proposta aprovada.",
    module: "comercial",
  },
  {
    code: "proposta.anular_revisao",
    label: "Anular revisão",
    description: "Autoriza a anulação de uma revisão de proposta.",
    module: "comercial",
  },
  {
    code: "pedido.cancelar",
    label: "Cancelar pedido",
    description: "Autoriza o cancelamento de pedidos.",
    module: "comercial",
  },
  {
    code: "pedido.alterar_aprovado",
    label: "Alterar pedido aprovado",
    description: "Autoriza alterações em pedidos já aprovados.",
    module: "comercial",
  },
  {
    code: "producao.liberar",
    label: "Liberar produção",
    description: "Autoriza a liberação de ordens para a fábrica.",
    module: "producao",
  },
  {
    code: "producao.reabrir",
    label: "Reabrir ordem concluída",
    description: "Autoriza a reabertura de ordens de produção concluídas.",
    module: "producao",
  },
  {
    code: "compra.aprovar",
    label: "Aprovar compra",
    description: "Autoriza a aprovação de pedidos de compra.",
    module: "compras",
  },
  {
    code: "financeiro.alterar_valores",
    label: "Alterar valores financeiros",
    description: "Autoriza a alteração de valores e vencimentos de títulos.",
    module: "financeiro",
  },
  {
    code: "financeiro.estornar",
    label: "Estornar movimentações",
    description: "Autoriza o estorno de recebimentos e pagamentos.",
    module: "financeiro",
  },
  {
    code: "dados.custos",
    label: "Visualizar custos internos",
    description: "Autoriza a visualização de custos e margens.",
    module: "relatorios",
  },
  {
    code: "dados.confidenciais",
    label: "Visualizar documentos confidenciais",
    description: "Autoriza o acesso a contratos e documentos financeiros.",
    module: "financeiro",
  },
  {
    code: "arquivos.excluir",
    label: "Excluir arquivos",
    description: "Autoriza a exclusão de arquivos vinculados a registros.",
    module: "cadastros",
  },
  {
    code: "usuario.excluir",
    label: "Excluir usuários",
    description: "Autoriza a exclusão de usuários da plataforma.",
    module: "administracao",
  },
  {
    code: "usuario.resetar_senha",
    label: "Redefinir senhas",
    description: "Autoriza a redefinição de senha de outros usuários.",
    module: "administracao",
  },
  {
    code: "permissoes.alterar",
    label: "Alterar permissões",
    description: "Autoriza a alteração de grupos, perfis e permissões.",
    module: "administracao",
  },
];

export const SPECIAL_PERMISSION_MAP: Record<SpecialPermissionCode, SpecialPermission> =
  Object.fromEntries(SPECIAL_PERMISSIONS.map((item) => [item.code, item])) as Record<
    SpecialPermissionCode,
    SpecialPermission
  >;

export function getSpecialPermission(
  code: SpecialPermissionCode,
): SpecialPermission | undefined {
  return SPECIAL_PERMISSION_MAP[code];
}
