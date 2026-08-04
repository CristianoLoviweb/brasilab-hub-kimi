import { FlaskConical } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCESS_GROUP_LIST } from "@/features/access/config/accessGroups";
import type { AccessGroupCode } from "@/features/access/types";
import { MOCK_PROFILES } from "@/features/profiles/data/mockProfiles";

interface DevGroupSwitcherProps {
  value: AccessGroupCode;
  onChange: (code: AccessGroupCode) => void;
  profileId?: string | null;
  onProfileChange?: (profileId: string | null) => void;
}

const NO_PROFILE = "__padrao__";

/**
 * ============================================================================
 * DEVELOPMENT ONLY
 * ----------------------------------------------------------------------------
 * Este seletor existe apenas para facilitar os testes dos Dashboards durante o
 * desenvolvimento da plataforma (Grupo e sobrescrita por Perfil).
 *
 * Na implementação definitiva da Autenticação e Permissões, o Grupo de Acesso
 * e o Perfil serão obtidos automaticamente através do usuário autenticado e
 * validados no backend (docs/10_SEGURANCA_DA_INFORMACAO.md).
 *
 * O usuário final NUNCA visualizará este seletor.
 * Este componente deverá ser removido junto com o hook de simulação
 * (src/features/access/hooks/useAccessGroup.ts) quando a Autenticação
 * definitiva estiver pronta.
 * ============================================================================
 */

export function DevGroupSwitcher({
  value,
  onChange,
  profileId,
  onProfileChange,
}: DevGroupSwitcherProps) {
  const profiles = MOCK_PROFILES.filter((profile) => profile.groupCode === value);

  return (
    <div className="border-warning/60 bg-warning/5 flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <FlaskConical className="h-3.5 w-3.5" />
        Simulação de desenvolvimento
      </span>
      <Select value={value} onValueChange={(next) => onChange(next as AccessGroupCode)}>
        <SelectTrigger className="h-8 w-[190px]" aria-label="Grupo de Acesso simulado">
          <SelectValue placeholder="Grupo de Acesso" />
        </SelectTrigger>
        <SelectContent>
          {ACCESS_GROUP_LIST.map((group) => (
            <SelectItem key={group.code} value={group.code}>
              {group.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onProfileChange ? (
        <Select
          value={profileId ?? NO_PROFILE}
          onValueChange={(next) => onProfileChange(next === NO_PROFILE ? null : next)}
        >
          <SelectTrigger className="h-8 w-[210px]" aria-label="Perfil simulado">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_PROFILE}>Padrão do grupo</SelectItem>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
