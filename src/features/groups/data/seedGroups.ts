import { ACCESS_GROUP_LIST } from "@/features/access/config/accessGroups";
import type { AccessGroupCode } from "@/features/access/types";

import type { Group } from "../types";

/**
 * Grupos estruturais da empresa — cadastro inicial da plataforma.
 *
 * Os Grupos reaproveitam a configuração de acesso já existente
 * (src/features/access/config/accessGroups.ts) — nenhuma regra é duplicada.
 * Aqui apenas complementamos os dados cadastrais do setor.
 *
 * Sprint 03.1: nenhum dado fictício. Os responsáveis por cada área serão
 * definidos conforme os usuários reais forem cadastrados na plataforma.
 */
const SETUP_DATE = "2026-08-05T00:00:00.000Z";

const GROUP_METADATA: Record<
  AccessGroupCode,
  { manager: string; email: string; createdAt: string; active: boolean }
> = {
  administracao: {
    manager: "",
    email: "administracao@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  diretoria: {
    manager: "",
    email: "diretoria@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  comercial: {
    manager: "",
    email: "comercial@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  financeiro: {
    manager: "",
    email: "financeiro@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  producao: {
    manager: "",
    email: "producao@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  compras: {
    manager: "",
    email: "compras@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  logistica: {
    manager: "",
    email: "logistica@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
  engenharia: {
    manager: "",
    email: "engenharia@brasilab.com.br",
    createdAt: SETUP_DATE,
    active: true,
  },
};

export const SEED_GROUPS: Group[] = ACCESS_GROUP_LIST.map((accessGroup) => ({
  code: accessGroup.code,
  name: accessGroup.label,
  description: accessGroup.description,
  modules: accessGroup.modules,
  permissions: accessGroup.permissions,
  ...GROUP_METADATA[accessGroup.code],
}));
