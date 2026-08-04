import type { ReactNode } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  /** Identificador único da coluna. */
  key: string;
  header: string;
  /** Classe aplicada à célula e ao cabeçalho (alinhamento, largura, etc.). */
  className?: string;
  /** Oculta a coluna em telas pequenas. */
  hideOnMobile?: boolean;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

/**
 * Tabela padrão da plataforma.
 * Componente genérico e reutilizável — nenhum módulo deverá criar sua própria
 * tabela (docs/07_PADROES_DE_DESENVOLVIMENTO.md — reutilização).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Ajuste a pesquisa ou os filtros aplicados.",
  className,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(column.className, column.hideOnMobile && "hidden md:table-cell")}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getRowId(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    column.className,
                    column.hideOnMobile && "hidden md:table-cell",
                  )}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
