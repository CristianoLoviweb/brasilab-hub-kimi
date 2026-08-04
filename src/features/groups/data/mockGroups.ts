import { ACCESS_GROUP_LIST } from "@/features/access/config/accessGroups";
import type { AccessGroupCode } from "@/features/access/types";

import type { Group } from "../types";

/**
 * DEVELOPMENT ONLY (dados simulados)
 *
 * Os Grupos reaproveitam a configuração de acesso já existente
 * (src/features/access/config/accessGroups.ts) — nenhuma regra é duplicada.
 * Aqui apenas complementamos os dados cadastrais do setor.
 */
const GROUP_METADATA: Record<
  AccessGroupCode,
  { manager: string; email: string; createdAt: string; active: boolean }
> = {
  administracao: {
    manager: "Marina Duarte",
    email: "administracao@brasilab.com.br",
    createdAt: "2024-01-08T09:00:00.000Z",
    active: true,
  },
  diretoria: {
    manager: "Roberto Salles",
    email: "diretoria@brasilab.com.br",
    createdAt: "2024-01-08T09:10:00.000Z",
    active: true,
  },
  comercial: {
    manager: "Camila Nogueira",
    email: "comercial@brasilab.com.br",
    createdAt: "2024-01-15T13:20:00.000Z",
    active: true,
  },
  financeiro: {
    manager: "Eduardo Prado",
    email: "financeiro@brasilab.com.br",
    createdAt: "2024-01-15T13:35:00.000Z",
    active: true,
  },
  producao: {
    manager: "Sérgio Bastos",
    email: "producao@brasilab.com.br",
    createdAt: "2024-02-02T11:05:00.000Z",
    active: true,
  },
  compras: {
    manager: "Aline Torres",
    email: "compras@brasilab.com.br",
    createdAt: "2024-02-02T11:20:00.000Z",
    active: true,
  },
  logistica: {
    manager: "Paulo Menezes",
    email: "logistica@brasilab.com.br",
    createdAt: "2024-03-11T08:45:00.000Z",
    active: true,
  },
  engenharia: {
    manager: "Fernanda Lima",
    email: "engenharia@brasilab.com.br",
    createdAt: "2024-03-11T09:00:00.000Z",
    active: true,
  },
};

export const MOCK_GROUPS: Group[] = ACCESS_GROUP_LIST.map((accessGroup) => ({
  code: accessGroup.code,
  name: accessGroup.label,
  description: accessGroup.description,
  modules: accessGroup.modules,
  permissions: accessGroup.permissions,
  ...GROUP_METADATA[accessGroup.code],
}));
