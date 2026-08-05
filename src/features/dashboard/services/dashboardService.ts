import { resolveWidgetDataFn } from "@/server/fns/adminFns";

import type { WidgetData } from "../data/widgetData";

/**
 * Service oficial do Dashboard (Sprint 03.2).
 *
 * Todos os indicadores continuam calculados dinamicamente — agora no
 * servidor, sobre dados reais do PostgreSQL. Os indicadores cujos módulos
 * ainda não possuem fonte de dados permanecem zerados (zeros reais).
 * O contrato público permanece exatamente o mesmo.
 */

/**
 * Resolve os dados de um Widget calculando-os nos Services oficiais.
 * Chaves sem fonte de dados dinâmica retornam a base zerada do catálogo.
 */
export async function resolveWidgetData(dataKey: string): Promise<WidgetData | undefined> {
  return resolveWidgetDataFn({ data: dataKey });
}
