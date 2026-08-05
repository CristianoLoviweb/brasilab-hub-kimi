import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/common/DataTable";
import type { DataTableColumn } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { StatusTone } from "@/components/common/StatusBadge";
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
import { SEED_PROFILES } from "@/features/profiles/data/seedProfiles";
import { listUsers } from "@/features/users/services/userService";
import { USER_STATUS_LABELS } from "@/features/users/types";
import type { User, UserStatus } from "@/features/users/types";
import { formatDate } from "@/lib/query";

export const Route = createFileRoute("/_authenticated/administracao/usuarios/")({
  head: () => ({
    meta: [
      { title: "Usuários · Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Listagem, pesquisa e gestão dos usuários autorizados a utilizar a Brasilab Intranet Lab.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Usuários · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Gestão dos usuários da Intranet: grupo, perfil e situação.",
      },
    ],
  }),
  component: UsuariosPage,
});

const STATUS_TONE: Record<UserStatus, StatusTone> = {
  ativo: "success",
  inativo: "neutral",
  bloqueado: "danger",
};

function profileName(profileId: string): string {
  return SEED_PROFILES.find((profile) => profile.id === profileId)?.name ?? "—";
}

function groupName(code: string): string {
  return ACCESS_GROUP_LIST.find((group) => group.code === code)?.label ?? code;
}

function UsuariosPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "todos">("todos");
  const [groupCode, setGroupCode] = useState<string>("todos");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["users", "list", { search, status, groupCode, page }],
    queryFn: () => listUsers({ search, status, groupCode, page }),
  });

  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      header: "Usuário",
      cell: (user) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "registration",
      header: "Matrícula",
      hideOnMobile: true,
      cell: (user) => user.registration,
    },
    { key: "group", header: "Grupo", cell: (user) => groupName(user.groupCode) },
    {
      key: "profile",
      header: "Perfil",
      hideOnMobile: true,
      cell: (user) => profileName(user.profileId),
    },
    {
      key: "lastAccess",
      header: "Último acesso",
      hideOnMobile: true,
      cell: (user) => (user.lastAccessAt ? formatDate(user.lastAccessAt) : "Nunca acessou"),
    },
    {
      key: "status",
      header: "Situação",
      className: "text-right",
      cell: (user) => (
        <StatusBadge label={USER_STATUS_LABELS[user.status]} tone={STATUS_TONE[user.status]} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Pessoas autorizadas a utilizar a Intranet, com grupo, perfil e situação."
        icon={Users}
        actions={
          <Button asChild>
            <Link to="/administracao/usuarios/novo">
              <Plus className="h-4 w-4" />
              Novo usuário
            </Link>
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
          placeholder="Pesquisar por nome, e-mail ou matrícula"
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as UserStatus | "todos");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as situações</SelectItem>
            {Object.entries(USER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={query.data?.items ?? []}
            getRowId={(user) => user.id}
            onRowClick={(user) =>
              navigate({
                to: "/administracao/usuarios/$userId",
                params: { userId: user.id },
              })
            }
            emptyTitle="Nenhum usuário encontrado"
            emptyDescription="Ajuste a pesquisa ou os filtros aplicados."
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
    </div>
  );
}
