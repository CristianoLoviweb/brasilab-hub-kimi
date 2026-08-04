import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, History, IdCard, KeyRound, ShieldCheck, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_GROUPS } from "@/features/groups/data/mockGroups";
import { MOCK_PROFILES } from "@/features/profiles/data/mockProfiles";
import { getAuditSummary } from "@/features/audit/services/auditService";
import { getUsersSummary } from "@/features/users/services/userService";

export const Route = createFileRoute("/_authenticated/administracao/")({
  head: () => ({
    meta: [
      { title: "Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Estrutura organizacional da Brasilab: usuários, grupos, perfis, permissões e auditoria da Intranet.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administração · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Gestão de usuários, grupos, perfis, permissões e auditoria.",
      },
    ],
  }),
  component: AdministracaoPage,
});

const SECTIONS = [
  {
    to: "/administracao/usuarios",
    label: "Usuários",
    description: "Cadastro, situação, perfil e permissões individuais.",
    icon: Users,
  },
  {
    to: "/administracao/grupos",
    label: "Grupos",
    description: "Setores da empresa e módulos liberados para cada área.",
    icon: Building2,
  },
  {
    to: "/administracao/perfis",
    label: "Perfis",
    description: "Funções exercidas dentro de cada Grupo.",
    icon: IdCard,
  },
  {
    to: "/administracao/permissoes",
    label: "Permissões",
    description: "Permissões gerais por módulo e permissões especiais.",
    icon: KeyRound,
  },
  {
    to: "/administracao/auditoria",
    label: "Auditoria",
    description: "Trilha imutável de eventos registrados na plataforma.",
    icon: History,
  },
] as const;

function AdministracaoPage() {
  const users = useQuery({ queryKey: ["users", "summary"], queryFn: getUsersSummary });
  const audit = useQuery({ queryKey: ["audit", "summary"], queryFn: getAuditSummary });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administração"
        description="Estrutura organizacional da plataforma: usuários, grupos, perfis, permissões e auditoria."
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Usuários cadastrados"
          value={String(users.data?.total ?? "—")}
          icon={Users}
        />
        <StatCard
          label="Usuários ativos"
          value={String(users.data?.ativos ?? "—")}
          icon={ShieldCheck}
        />
        <StatCard label="Grupos" value={String(MOCK_GROUPS.length)} icon={Building2} />
        <StatCard label="Perfis" value={String(MOCK_PROFILES.length)} icon={IdCard} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className="block">
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-primary/10 p-2 text-primary">
                    <section.icon className="h-4 w-4" />
                  </span>
                  <CardTitle className="text-base">{section.label}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base">Trilha de auditoria</CardTitle>
            <CardDescription>
              {audit.data
                ? `${audit.data.total} eventos registrados · ${audit.data.criticos} críticos`
                : "Carregando resumo..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Os registros de auditoria são imutáveis: nunca podem ser alterados ou
            excluídos.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
