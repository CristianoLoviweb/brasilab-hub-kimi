import { z } from "zod";

/** Validações do cadastro de Grupos. */
export const groupFormSchema = z.object({
  code: z.string().min(2, "Informe o código do grupo"),
  name: z.string().trim().min(3, "Informe o nome do grupo").max(80),
  description: z.string().trim().min(5, "Descreva a área").max(240),
  manager: z.string().trim().min(3, "Informe o responsável").max(120),
  email: z.string().trim().email("E-mail inválido"),
  active: z.boolean(),
  modules: z.array(z.string()).min(1, "Selecione ao menos um módulo"),
});

export type GroupFormValues = z.input<typeof groupFormSchema>;
