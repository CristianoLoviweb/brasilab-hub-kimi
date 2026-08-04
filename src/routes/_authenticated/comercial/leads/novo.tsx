import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { LeadForm } from "@/features/leads/components/LeadForm";
import { LEAD_PERMISSIONS } from "@/features/leads/constants/leadPermissions";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import { createLead } from "@/features/leads/services/leadService";
import type { LeadInput } from "@/features/leads/types";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/_authenticated/comercial/leads/novo")({
  head: () => ({
    meta: [
      { title: "Novo Lead · Comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Cadastro manual de Lead na Brasilab: dados do solicitante, interesse, origem, prioridade e atribuição.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Novo Lead · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Cadastro manual de oportunidades comerciais.",
      },
    ],
  }),
  component: NovoLeadPage,
});

function NovoLeadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, can } = useCommercialActor();

  const create = useMutation({
    mutationFn: (input: LeadInput) => createLead(input, actor),
    onSuccess: (lead) => {
      toast.success(`Lead ${lead.code} cadastrado.`);
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
      void navigate({ to: "/comercial/leads/$leadId", params: { leadId: lead.id } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!can(LEAD_PERMISSIONS.criar)) {
    return (
      <EmptyState
        title="Acesso não permitido"
        description="Seu Perfil não possui permissão para cadastrar Leads."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo Lead"
        description="Cadastro manual de oportunidade comercial. Sem atribuição, o Lead entra na fila pública."
        icon={Plus}
      />

      <LeadForm
        allowDirectAssignment={can(LEAD_PERMISSIONS.atribuirDiretamente)}
        submitting={create.isPending}
        onSubmit={async (input) => {
          await create.mutateAsync(input);
        }}
        onCancel={() => void navigate({ to: "/comercial/leads" })}
      />
    </div>
  );
}
