import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { IdCard, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/common/DataTable";
import type { DataTableColumn } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TablePagination } from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ACCESS_GROUP_LIST } from "@/features/access/config/accessGroups";
import { ProfileFormDialog } from "@/features/profiles/components/ProfileFormDialog";
import {
  createProfile,
  deleteProfile,
  listProfiles,
  updateProfile,
} from "@/features/profiles/services/profileService";
import { PROFILE_LEVEL_LABELS } from "@/features/profiles/types";
import type { Profile, ProfileInput } from "@/features/profiles/types";
import { countUsersBy } from "@/features/users/services/userService";

export const Route = createFileRoute("/_authenticated/administracao/perfis")({
  head: () => ({
    meta: [
      { title: "Perfis · Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Perfis da Brasilab Intranet Lab: funções exercidas dentro de cada grupo e nível hierárquico.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Perfis · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Funções exercidas dentro de cada Grupo e seus níveis.",
      },
    ],
  }),
  component: PerfisPage,
});

function PerfisPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [groupCode, setGroupCode] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | undefined>(undefined);

  const query = useQuery({
    queryKey: ["profiles", "list", { search, groupCode, page }],
    queryFn: () => listProfiles({ search, groupCode, page }),
  });

  const counts = useQuery({
    queryKey: ["users", "count", "profileId"],
    queryFn: () => countUsersBy("profileId"),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    await queryClient.invalidateQueries({ queryKey: ["audit"] });
  };

  const saveMutation = useMutation({
    mutationFn: (input: ProfileInput) =>
      editing ? updateProfile(editing.id, input) : createProfile(input),
    onSuccess: async () => {
      await invalidate();
      setDialogOpen(false);
      setEditing(undefined);
      toast.success("Perfil salvo com sucesso");
    },
    onError: () => toast.error("Não foi possível salvar o perfil"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("Perfil excluído");
    },
    onError: () => toast.error("Não foi possível excluir o perfil"),
  });

  const columns: DataTableColumn<Profile>[] = [
    {
      key: "name",
      header: "Perfil",
      cell: (profile) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{profile.name}</p>
          <p className="truncate text-xs text-muted-foreground">{profile.description}</p>
        </div>
      ),
    },
    {
      key: "group",
      header: "Grupo",
      cell: (profile) =>
        ACCESS_GROUP_LIST.find((group) => group.code === profile.groupCode)?.label ??
        profile.groupCode,
    },
    {
      key: "level",
      header: "Nível",
      hideOnMobile: true,
      cell: (profile) => `${profile.level} · ${PROFILE_LEVEL_LABELS[profile.level]}`,
    },
    {
      key: "special",
      header: "Permissões especiais",
      hideOnMobile: true,
      cell: (profile) => profile.specialPermissions.length,
    },
    {
      key: "users",
      header: "Usuários",
      hideOnMobile: true,
      cell: (profile) => counts.data?.[profile.id] ?? 0,
    },
    {
      key: "status",
      header: "Situação",
      cell: (profile) => (
        <StatusBadge
          label={profile.active ? "Ativo" : "Inativo"}
          tone={profile.active ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (profile) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Editar ${profile.name}`}
            onClick={() => {
              setEditing(profile);
              setDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" aria-label={`Excluir ${profile.name}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
            title="Excluir perfil"
            description="O perfil só pode ser excluído quando não possuir usuários vinculados."
            confirmLabel="Excluir perfil"
            onConfirm={() => deleteMutation.mutate(profile.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfis"
        description="Funções exercidas dentro de cada Grupo, com nível hierárquico e permissões especiais."
        icon={IdCard}
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Novo perfil
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Pesquisar perfil"
        />
        <Select
          value={groupCode}
          onValueChange={(value) => {
            setGroupCode(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os grupos</SelectItem>
            {ACCESS_GROUP_LIST.map((group) => (
              <SelectItem key={group.code} value={group.code}>
                {group.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {query.isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={query.data?.items ?? []}
            getRowId={(profile) => profile.id}
            emptyTitle="Nenhum perfil encontrado"
          />
          <TablePagination
            page={query.data?.page ?? 1}
            totalPages={query.data?.totalPages ?? 1}
            total={query.data?.total ?? 0}
            pageSize={query.data?.pageSize ?? 10}
            onPageChange={setPage}
          />
        </>
      )}

      <ProfileFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(undefined);
        }}
        {...(editing ? { profile: editing } : {})}
        onSubmit={(input) => saveMutation.mutate(input)}
      />
    </div>
  );
}
