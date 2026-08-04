import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface DetailItem {
  label: string;
  value: ReactNode;
}

/** Lista de atributos (rótulo/valor) usada nas páginas de detalhes. */
export function DetailList({
  items,
  columns = 2,
  className,
}: {
  items: DetailItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const gridClass =
    columns === 1 ? "sm:grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-4", gridClass, className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm break-words">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
