import { Megaphone } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { NoticeMock } from "@/features/dashboard/data/mockDashboard";

interface NoticesCardProps {
  items: NoticeMock[];
  title?: string;
  description?: string;
}

/** Widget reutilizável: Notice Card. */
export function NoticesCard({
  items,
  title = "Avisos",
  description = "Comunicados internos",
}: NoticesCardProps) {
  return (
    <SectionCard title={title} description={description} icon={Megaphone}>
      <div className="space-y-3">
        {items.map((notice) => (
          <Alert key={notice.id}>
            <AlertTitle>{notice.title}</AlertTitle>
            <AlertDescription>{notice.description}</AlertDescription>
          </Alert>
        ))}
      </div>
    </SectionCard>
  );
}
