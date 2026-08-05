import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { GroupFormDialog } from "@/features/groups/components/GroupFormDialog";
import {
  createGroup,
  deleteGroup,
  listGroups,
  updateGroup,
} from "@/features/groups/services/groupService";
import type { Group, GroupInput } from "@/features/groups/types";
import { SEED_PROFILES } from "@/features/profiles/data/seedProfiles";
import { countUsersBy } from "@/features/users/services/userService";

export const Route = createFileRoute("/_authenticated/administracao/grupos")({
  head: () => ({
    meta: [
      { title: "Grupos · Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Setores da Brasilab, responsáveis por área e módulos liberados para cada grupo da Intranet.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Grupos · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Setores da empresa e módulos liberados por área.",
      },
    ],
  }),
  component: GruposPage,
});

function GruposPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Group | undefined>(undefined);

  const query = useQuery({
    queryKey: ["groups", "list", { search, page }],
    queryFn: () => listGroups({ search, page }),
  });

  const counts = useQuery({
    queryKey: ["users", "count", "groupCode"],
    queryFn: () => countUsersBy("groupCode"),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["groups"] });
    await queryClient.invalidateQueries({ queryKey: ["audit"] });
  };

  const saveMutation = useMutation({
    mutationFn: (input: GroupInput) =>
      editing ? updateGroup(editing.code, input) : createGroup(input),
    onSuccess: async () => {
      await invalidate();
      setDialogOpen(false);
      setEditing(undefined);
      toast.success("Grupo salvo com sucesso");
    },
    onError: () => toast.error("Não foi possível salvar o grupo"),
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) => deleteGroup(code),
    onSuccess: async () => {
      await invalidate();
      toast.success("Grupo excluído");
    },
    onError: () => toast.error("Não foi possível excluir o grupo"),
  });

  const columns: DataTableColumn<Group>[] = [
    {
      key: "name",
      header: "Grupo",
      cell: (group) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{group.name}</p>
          <p className="truncate text-xs text-muted-foreground">{group.description}</p>
        </div>
      ),
    },
    { key: "manager", header: "Responsável", hideOnMobile: true, cell: (g) => g.manager },
    {
      key: "users",
      header: "Usuários",
      hideOnMobile: true,
      cell: (group) => counts.data?.[group.code] ?? 0,
    },
    {
      key: "profiles",
      header: "Perfis",
      hideOnMobile: true,
      cell: (group) =>
        SEED_PROFILES.filter((profile) => profile.groupCode === group.code).length,
    },
    {
      key: "modules",
      header: "Módulos",
      hideOnMobile: true,
      cell: (group) => group.modules.length,
    },
    {
      key: "status",
      header: "Situação",
      cell: (group) => (
        <StatusBadge
          label={group.active ? "Ativo" : "Inativo"}
          tone={group.active ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (group) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Editar ${group.name}`}
            onClick={() => {
              setEditing(group);
              setDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" aria-label={`Excluir ${group.name}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
            title="Excluir grupo"
            description="O grupo só pode ser excluído quando não possuir usuários vinculados."
            confirmLabel="Excluir grupo"
            onConfirm={() => deleteMutation.mutate(group.code)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grupos"
        description="Setores da empresa. O Grupo define a área de atuação e os módulos liberados."
        icon={Building2}
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Novo grupo
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Pesquisar grupo"
      />

      {query.isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={query.data?.items ?? []}
            getRowId={(group) => group.code}
            emptyTitle="Nenhum grupo encontrado"
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

      <GroupFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(undefined);
        }}
        {...(editing ? { group: editing } : {})}
        onSubmit={(input) => saveMutation.mutate(input)}
      />
    </div>
  );
}
