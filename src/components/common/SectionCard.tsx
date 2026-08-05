import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/** Card padrão de seção — usado em dashboards, listagens e painéis. */
export function SectionCard({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 shrink-0 text-primary" /> : null}
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{title}</CardTitle>
            {description ? (
              <CardDescription className="truncate">{description}</CardDescription>
            ) : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
