import type { AccessGroup, ModuleAction } from "@/features/access/types";

import type {
  EffectivePermissions,
  PermissionMatrix,
  PermissionOverride,
  SpecialPermissionCode,
} from "../types";

/**
 * Resolução da hierarquia de acesso.
 *
 *   Grupo (base) → Perfil (sobrescrita) → Permissões Especiais
 *
 * Regras obrigatórias (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md):
 * - o Perfil pode liberar ou restringir ações DENTRO dos módulos do Grupo;
 * - o Perfil nunca concede acesso a módulo fora do Grupo;
 * - Permissões Especiais nunca concedem acesso a módulo não liberado.
 *
 * Esta resolução é apenas de apresentação. A validação definitiva ocorrerá no
 * backend (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */

function mergeMatrix(
  base: PermissionMatrix,
  granted: PermissionMatrix = {},
  revoked: PermissionMatrix = {},
  allowedModules: string[],
): PermissionMatrix {
  const result: PermissionMatrix = {};

  for (const moduleSlug of allowedModules) {
    result[moduleSlug] = {
      ...(base[moduleSlug] ?? {}),
      ...(granted[moduleSlug] ?? {}),
    };

    const revokedActions = revoked[moduleSlug];
    if (revokedActions) {
      for (const [action, isRevoked] of Object.entries(revokedActions)) {
        if (isRevoked) result[moduleSlug][action as ModuleAction] = false;
      }
    }
  }

  return result;
}

export interface ResolveInput {
  group: AccessGroup;
  override?: PermissionOverride;
  /** Permissões Especiais atribuídas ao Perfil ou diretamente ao Usuário. */
  special?: SpecialPermissionCode[];
}

export function resolveEffectivePermissions({
  group,
  override,
  special = [],
}: ResolveInput): EffectivePermissions {
  // Módulos do Perfil nunca extrapolam os módulos do Grupo.
  const modules = override?.modules
    ? override.modules.filter((slug) => group.modules.includes(slug))
    : group.modules;

  const matrix = mergeMatrix(
    group.permissions,
    override?.granted,
    override?.revoked,
    modules,
  );

  const canAccessModule = (moduleSlug: string) => modules.includes(moduleSlug);

  const can = (moduleSlug: string, action: ModuleAction) =>
    canAccessModule(moduleSlug) && matrix[moduleSlug]?.[action] === true;

  // Permissão Especial exige acesso ao módulo correspondente.
  const hasSpecial = (code: SpecialPermissionCode) => special.includes(code);

  return { modules, matrix, special, can, hasSpecial, canAccessModule };
}

/** Conta quantas ações estão liberadas — usado nos cards informativos. */
export function countGrantedActions(matrix: PermissionMatrix): number {
  return Object.values(matrix).reduce(
    (total, actions) => total + Object.values(actions).filter(Boolean).length,
    0,
  );
}
