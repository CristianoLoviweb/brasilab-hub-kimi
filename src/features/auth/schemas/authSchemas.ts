import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail corporativo")
    .email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve possuir no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const passwordRecoverySchema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail corporativo")
    .email("Informe um e-mail válido"),
});

export type PasswordRecoveryFormValues = z.infer<typeof passwordRecoverySchema>;
