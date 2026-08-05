import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Ban, CheckCircle2, Trash2, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DetailList } from "@/components/common/DetailList";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { StatusTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCESS_GROUP_LIST, getAccessGroup } from "@/features/access/config/accessGroups";
import { AuditTimeline } from "@/features/audit/components/AuditTimeline";
import { listEntityHistory } from "@/features/audit/services/auditService";
import { SPECIAL_PERMISSIONS } from "@/features/permissions/config/specialPermissions";
import { PermissionMatrixTable } from "@/features/permissions/components/PermissionMatrixTable";
import { resolveEffectivePermissions } from "@/features/permissions/services/permissionsService";
import { SEED_PROFILES } from "@/features/profiles/data/seedProfiles";
import { UserForm } from "@/features/users/components/UserForm";
import {
  changeUserStatus,
  deleteUser,
  getUser,
  updateUser,
} from "@/features/users/services/userService";
import { USER_STATUS_LABELS } from "@/features/users/types";
import type { UserInput, UserStatus } from "@/features/users/types";
import { formatDate, formatDateTime } from "@/lib/query";

export const Route = createFileRoute("/_authenticated/administracao/usuarios/$userId")({
  head: () => ({
    meta: [
      { title: "Detalhes do usuário · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Dados cadastrais, permissões efetivas e histórico de auditoria do usuário da Intranet.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Detalhes do usuário · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Cadastro, permissões efetivas e histórico do usuário.",
      },
    ],
  }),
  component: UsuarioDetalhePage,
});

const STATUS_TONE: Record<UserStatus, StatusTone> = {
  ativo: "success",
  inativo: "neutral",
  bloqueado: "danger",
};

function UsuarioDetalhePage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const userQuery = useQuery({
    queryKey: ["users", "detail", userId],
    queryFn: () => getUser(userId),
  });

  const historyQuery = useQuery({
    queryKey: ["audit", "entity", userId],
    queryFn: () => listEntityHistory(userId),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    await queryClient.invalidateQueries({ queryKey: ["audit"] });
  };

  const updateMutation = useMutation({
    mutationFn: (input: UserInput) => updateUser(userId, input),
    onSuccess: async () => {
      await invalidate();
      setEditing(false);
      toast.success("Usuário atualizado");
    },
    onError: () => toast.error("Não foi possível atualizar o usuário"),
  });

  const statusMutation = useMutation({
    mutationFn: (status: UserStatus) => changeUserStatus(userId, status),
    onSuccess: async () => {
      await invalidate();
      toast.success("Situação atualizada");
    },
    onError: () => toast.error("Não foi possível alterar a situação"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: async () => {
      await invalidate();
      toast.success("Usuário excluído");
      navigate({ to: "/administracao/usuarios" });
    },
    onError: () => toast.error("Não foi possível excluir o usuário"),
  });

  if (userQuery.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const user = userQuery.data;

  if (!user) {
    return (
      <EmptyState
        title="Usuário não encontrado"
        description="O registro solicitado não existe ou foi removido."
      />
    );
  }

  const profile = SEED_PROFILES.find((item) => item.id === user.profileId);
  const group = getAccessGroup(user.groupCode);
  const groupLabel =
    ACCESS_GROUP_LIST.find((item) => item.code === user.groupCode)?.label ?? user.groupCode;

  const effective = resolveEffectivePermissions({
    group,
    ...(profile ? { override: profile.override } : {}),
    special: [...(profile?.specialPermissions ?? []), ...user.specialPermissions],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.name}
        description={`${user.position} · ${groupLabel}${profile ? ` · ${profile.name}` : ""}`}
        icon={UserCog}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/administracao/usuarios">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            {user.status === "bloqueado" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => statusMutation.mutate("ativo")}
              >
                <CheckCircle2 className="h-4 w-4" />
                Desbloquear
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => statusMutation.mutate("bloqueado")}
              >
                <Ban className="h-4 w-4" />
                Bloquear
              </Button>
            )}
            <ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              }
              title="Excluir usuário"
              description="Operação crítica: exige a Permissão Especial usuario.excluir. O histórico de auditoria será preservado."
              confirmLabel="Excluir usuário"
              onConfirm={() => deleteMutation.mutate()}
            />
            <Button size="sm" onClick={() => setEditing((value) => !value)}>
              {editing ? "Cancelar edição" : "Editar"}
            </Button>
          </div>
        }
      />

      {editing ? (
        <SectionCard title="Editar usuário" description="Altere os dados cadastrais.">
          <UserForm
            user={user}
            submitting={updateMutation.isPending}
            onSubmit={(input) => updateMutation.mutate(input)}
            onCancel={() => setEditing(false)}
          />
        </SectionCard>
      ) : (
        <Tabs defaultValue="dados">
          <TabsList>
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="permissoes">Permissões</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="mt-4">
            <SectionCard title="Dados cadastrais">
              <DetailList
                items={[
                  { label: "Nome", value: user.name },
                  { label: "E-mail", value: user.email },
                  { label: "Telefone", value: user.phone || "—" },
                  { label: "Matrícula", value: user.registration },
                  { label: "Cargo", value: user.position },
                  { label: "Grupo", value: groupLabel },
                  { label: "Perfil", value: profile?.name ?? "—" },
                  {
                    label: "Situação",
                    value: (
                      <StatusBadge
                        label={USER_STATUS_LABELS[user.status]}
                        tone={STATUS_TONE[user.status]}
                      />
                    ),
                  },
                  { label: "Cadastrado em", value: formatDate(user.createdAt) },
                  {
                    label: "Último acesso",
                    value: user.lastAccessAt
                      ? formatDateTime(user.lastAccessAt)
                      : "Nunca acessou",
                  },
                  { label: "Observações", value: user.notes ?? "—" },
                ]}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="permissoes" className="mt-4 space-y-4">
            <SectionCard
              title="Permissões gerais efetivas"
              description="Resultado da hierarquia Grupo → Perfil. A validação definitiva ocorrerá no backend."
              contentClassName="p-0 sm:p-0"
            >
              <PermissionMatrixTable
                modules={effective.modules}
                matrix={effective.matrix}
                {...(profile?.override.granted
                  ? { highlighted: profile.override.granted }
                  : {})}
              />
            </SectionCard>

            <SectionCard
              title="Permissões especiais"
              description="Operações críticas autorizadas para este usuário (Perfil + individuais)."
            >
              {effective.special.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma permissão especial concedida.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SPECIAL_PERMISSIONS.filter((permission) =>
                    effective.special.includes(permission.code),
                  ).map((permission) => (
                    <li key={permission.code} className="rounded-lg border px-3 py-2 text-sm">
                      <p className="font-medium">{permission.label}</p>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <SectionCard
              title="Histórico de auditoria"
              description="Registros imutáveis relacionados a este usuário."
            >
              {historyQuery.isPending ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <AuditTimeline events={historyQuery.data ?? []} />
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
