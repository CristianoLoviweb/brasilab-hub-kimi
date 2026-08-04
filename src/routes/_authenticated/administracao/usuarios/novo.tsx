import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { UserForm } from "@/features/users/components/UserForm";
import { createUser } from "@/features/users/services/userService";
import type { UserInput } from "@/features/users/types";

export const Route = createFileRoute("/_authenticated/administracao/usuarios/novo")({
  head: () => ({
    meta: [
      { title: "Novo usuário · Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Cadastro de um novo usuário da Brasilab Intranet Lab, com grupo, perfil e permissões especiais.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Novo usuário · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Cadastro de usuário com grupo, perfil e permissões especiais.",
      },
    ],
  }),
  component: NovoUsuarioPage,
});

function NovoUsuarioPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: UserInput) => createUser(input),
    onSuccess: async (user) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["audit"] });
      toast.success("Usuário cadastrado com sucesso");
      navigate({
        to: "/administracao/usuarios/$userId",
        params: { userId: user.id },
      });
    },
    onError: () => toast.error("Não foi possível cadastrar o usuário"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo usuário"
        description="Informe os dados do colaborador e defina grupo, perfil e situação."
        icon={UserPlus}
      />

      <SectionCard
        title="Dados do usuário"
        description="O Grupo define a área de atuação; o Perfil define a função exercida."
      >
        <UserForm
          submitting={mutation.isPending}
          onSubmit={(input) => mutation.mutate(input)}
          onCancel={() => navigate({ to: "/administracao/usuarios" })}
        />
      </SectionCard>
    </div>
  );
}
