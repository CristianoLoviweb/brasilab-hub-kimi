import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  trend?: { direction: TrendDirection; value: string };
}

const TREND_ICON: Record<TrendDirection, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight,
};

const TREND_CLASS: Record<TrendDirection, string> = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

export function StatCard({ label, value, helper, icon: Icon, trend }: StatCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;

  return (
    <Card className="shadow-card">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {trend && TrendIcon ? (
              <span
                className={cn("inline-flex items-center gap-1", TREND_CLASS[trend.direction])}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {trend.value}
              </span>
            ) : null}
            {helper ? <span className="text-muted-foreground">{helper}</span> : null}
          </div>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
