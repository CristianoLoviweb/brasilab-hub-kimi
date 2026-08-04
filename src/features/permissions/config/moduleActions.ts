import type { ModuleAction } from "@/features/access/types";

/** Rótulos oficiais das ações — utilizados em toda a interface. */
export const MODULE_ACTION_LABELS: Record<ModuleAction, string> = {
  visualizar: "Visualizar",
  criar: "Criar",
  editar: "Editar",
  excluir: "Excluir",
  aprovar: "Aprovar",
  cancelar: "Cancelar",
  exportar: "Exportar",
  importar: "Importar",
  imprimir: "Imprimir",
  administrar: "Administrar",
  arquivos: "Arquivos",
};

/**
 * Ações controláveis por módulo (Permissões Gerais).
 * Esta lista é a base da futura tela administrativa de Permissões.
 */
export const MODULE_ACTIONS: ModuleAction[] = [
  "visualizar",
  "criar",
  "editar",
  "excluir",
  "exportar",
  "importar",
  "administrar",
  "aprovar",
  "cancelar",
  "imprimir",
  "arquivos",
];
