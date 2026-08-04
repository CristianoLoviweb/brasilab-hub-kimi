import { createFileRoute, notFound } from "@tanstack/react-router";

import { ModuleUnavailable } from "@/components/common/ModuleUnavailable";
import { findNavigationItem } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/$module")({
  beforeLoad: ({ params }) => {
    const item = findNavigationItem(params.module);
    if (!item) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Módulo em desenvolvimento · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Este módulo da intranet Brasilab está previsto no roadmap e será liberado em uma Sprint futura.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Módulo em desenvolvimento · Brasilab" },
      {
        property: "og:description",
        content: "Módulo previsto no roadmap da Brasilab Intranet Lab.",
      },
    ],
  }),
  component: ModulePage,
});

function ModulePage() {
  const { module } = Route.useParams();
  const item = findNavigationItem(module);
  if (!item) return null;
  return <ModuleUnavailable module={item} />;
}
