import { MODULE_ACTIONS, MODULE_ACTION_LABELS } from "../config/moduleActions";
import type { PermissionMatrix } from "../types";
import { Check, Minus } from "lucide-react";

import { findNavigationItem } from "@/config/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PermissionMatrixTableProps {
  modules: string[];
  matrix: PermissionMatrix;
  /** Ações concedidas pelo Perfil sobre o padrão do Grupo. */
  highlighted?: PermissionMatrix;
}

/**
 * Matriz de Permissões Gerais (leitura).
 * A edição será liberada na tela administrativa quando o backend existir —
 * toda validação ocorrerá no servidor (docs/10_SEGURANCA_DA_INFORMACAO.md).
 */
export function PermissionMatrixTable({
  modules,
  matrix,
  highlighted,
}: PermissionMatrixTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[160px]">Módulo</TableHead>
            {MODULE_ACTIONS.map((action) => (
              <TableHead key={action} className="text-center text-xs whitespace-nowrap">
                {MODULE_ACTION_LABELS[action]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((moduleSlug) => (
            <TableRow key={moduleSlug}>
              <TableCell className="font-medium">
                {findNavigationItem(moduleSlug)?.label ?? moduleSlug}
              </TableCell>
              {MODULE_ACTIONS.map((action) => {
                const granted = matrix[moduleSlug]?.[action] === true;
                const fromProfile = highlighted?.[moduleSlug]?.[action] === true;

                return (
                  <TableCell key={action} className="text-center">
                    {granted ? (
                      <Check
                        className={cn(
                          "mx-auto h-4 w-4",
                          fromProfile ? "text-primary" : "text-success",
                        )}
                        aria-label="Permitido"
                      />
                    ) : (
                      <Minus
                        className="mx-auto h-4 w-4 text-muted-foreground/50"
                        aria-label="Não permitido"
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
