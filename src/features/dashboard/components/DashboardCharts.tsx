import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard } from "@/components/common/SectionCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartData } from "@/features/dashboard/data/widgetData";

interface ChartCardProps {
  chart: ChartData;
  title: string;
  description?: string;
}

/** Widget reutilizável: Chart Card (linha ou barra). */
export function ChartCard({ chart, title, description }: ChartCardProps) {
  const config = Object.fromEntries(
    chart.series.map((serie) => [serie.key, { label: serie.label, color: serie.color }]),
  ) satisfies ChartConfig;

  return (
    <SectionCard title={title} {...(description ? { description } : {})} icon={BarChart3}>
      <ChartContainer config={config} className="h-[260px] w-full">
        {chart.type === "line" ? (
          <LineChart data={chart.rows} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {chart.series.map((serie) => (
              <Line
                key={serie.key}
                dataKey={serie.key}
                stroke={`var(--color-${serie.key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={chart.rows} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey={chart.xKey} tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {chart.series.map((serie) => (
              <Bar
                key={serie.key}
                dataKey={serie.key}
                fill={`var(--color-${serie.key})`}
                radius={6}
              />
            ))}
          </BarChart>
        )}
      </ChartContainer>
    </SectionCard>
  );
}
