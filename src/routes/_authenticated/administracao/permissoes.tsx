import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCESS_GROUP_LIST, getAccessGroup } from "@/features/access/config/accessGroups";
import type { AccessGroupCode } from "@/features/access/types";
import { PermissionMatrixTable } from "@/features/permissions/components/PermissionMatrixTable";
import { SPECIAL_PERMISSIONS } from "@/features/permissions/config/specialPermissions";
import { resolveEffectivePermissions } from "@/features/permissions/services/permissionsService";
import { SEED_PROFILES } from "@/features/profiles/data/seedProfiles";

export const Route = createFileRoute("/_authenticated/administracao/permissoes")({
  head: () => ({
    meta: [
      { title: "Permissões · Administração · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Permissões gerais por módulo e permissões especiais da Brasilab Intranet Lab, por Grupo e Perfil.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Permissões · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Matriz de permissões gerais e catálogo de permissões especiais.",
      },
    ],
  }),
  component: PermissoesPage,
});

function PermissoesPage() {
  const [groupCode, setGroupCode] = useState<AccessGroupCode>("comercial");
  const [profileId, setProfileId] = useState<string>("nenhum");

  const group = getAccessGroup(groupCode);
  const profiles = SEED_PROFILES.filter((profile) => profile.groupCode === groupCode);
  const profile = profiles.find((item) => item.id === profileId);

  const effective = resolveEffectivePermissions({
    group,
    ...(profile ? { override: profile.override } : {}),
    special: profile?.specialPermissions ?? [],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissões"
        description="Hierarquia oficial: Grupo → Perfil → Permissões Gerais → Permissões Especiais."
        icon={KeyRound}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={groupCode}
          onValueChange={(value) => {
            setGroupCode(value as AccessGroupCode);
            setProfileId("nenhum");
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Grupo" />
          </SelectTrigger>
          <SelectContent>
            {ACCESS_GROUP_LIST.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={profileId} onValueChange={setProfileId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhum">Somente o Grupo</SelectItem>
            {profiles.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SectionCard
        title="Permissões gerais"
        description="Ações liberadas por módulo. As sobrescritas do Perfil aparecem destacadas."
        contentClassName="p-0 sm:p-0"
      >
        <PermissionMatrixTable
          modules={effective.modules}
          matrix={effective.matrix}
          {...(profile?.override.granted ? { highlighted: profile.override.granted } : {})}
        />
      </SectionCard>

      <SectionCard
        title="Permissões especiais"
        description="Operações críticas que exigem autorização explícita (docs/regras_de_negocio/07_PERMISSOES_ESPECIAIS.md)."
      >
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {SPECIAL_PERMISSIONS.map((permission) => {
            const granted = effective.special.includes(permission.code);
            return (
              <li
                key={permission.code}
                className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">{permission.label}</p>
                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                </div>
                <span
                  className={
                    granted
                      ? "shrink-0 text-xs font-medium text-success"
                      : "shrink-0 text-xs text-muted-foreground"
                  }
                >
                  {granted ? "Concedida" : "Não concedida"}
                </span>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}
