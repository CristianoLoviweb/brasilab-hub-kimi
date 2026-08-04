import { z } from "zod";

import type { AccessGroupCode } from "@/features/access/types";
import type { SpecialPermissionCode } from "@/features/permissions/types";
import type { UserStatus } from "../types";

/** Validações do cadastro de Usuários (docs/07_PADROES_DE_DESENVOLVIMENTO.md). */
export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe o nome completo")
    .max(120, "Máximo de 120 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail corporativo")
    .email("E-mail inválido")
    .max(160, "Máximo de 160 caracteres"),
  phone: z.string().trim().max(20, "Máximo de 20 caracteres"),
  registration: z
    .string()
    .trim()
    .min(3, "Informe a matrícula")
    .max(20, "Máximo de 20 caracteres"),
  position: z.string().trim().min(3, "Informe o cargo").max(80, "Máximo de 80 caracteres"),
  groupCode: z.string().min(1, "Selecione o grupo"),
  profileId: z.string().min(1, "Selecione o perfil"),
  status: z.enum(["ativo", "inativo", "bloqueado"]),
  notes: z.string().trim().max(400, "Máximo de 400 caracteres").optional(),
  specialPermissions: z.array(z.string()).default([]),
});

export type UserFormValues = z.input<typeof userFormSchema>;

export interface NormalizedUserForm {
  name: string;
  email: string;
  phone: string;
  registration: string;
  position: string;
  groupCode: AccessGroupCode;
  profileId: string;
  status: UserStatus;
  notes?: string;
  specialPermissions: SpecialPermissionCode[];
}
