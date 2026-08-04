import { z } from "zod";

/** Validações do cadastro de Perfis. */
export const profileFormSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome do perfil").max(80),
  description: z.string().trim().min(5, "Descreva a função").max(240),
  groupCode: z.string().min(1, "Selecione o grupo"),
  level: z.coerce.number().int().min(1).max(5),
  active: z.boolean(),
  specialPermissions: z.array(z.string()).default([]),
});

export type ProfileFormValues = z.input<typeof profileFormSchema>;
