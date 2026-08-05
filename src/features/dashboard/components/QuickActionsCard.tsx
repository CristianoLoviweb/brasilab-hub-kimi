import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { NAVIGATION_ITEMS } from "@/config/navigation";

interface QuickActionsCardProps {
  slugs: string[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Quick Actions. */
export function QuickActionsCard({
  slugs,
  title = "Atalhos rápidos",
  description = "Acesso direto às áreas",
}: QuickActionsCardProps) {
  const shortcuts = NAVIGATION_ITEMS.filter((item) => slugs.includes(item.slug));

  return (
    <SectionCard title={title} description={description} icon={Zap}>
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map((item) => (
          <Button
            key={item.slug}
            asChild
            variant="outline"
            className="h-auto justify-start gap-2 py-3"
          >
            {/* Os slugs vêm de NAVIGATION_ITEMS e correspondem a rotas reais. */}
            <Link to={`/${item.slug}` as "/"}>
              <item.icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate text-sm">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}
