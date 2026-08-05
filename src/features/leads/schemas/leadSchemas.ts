import { z } from "zod";

/**
 * Validações do módulo de Leads (docs/07_PADROES_DE_DESENVOLVIMENTO.md).
 * Nenhum campo é obrigatório por conveniência: a obrigatoriedade reflete o que
 * é indispensável para o atendimento comercial.
 */

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

export const leadFormSchema = z.object({
  /* solicitante */
  name: z
    .string()
    .trim()
    .min(3, "Informe o nome do solicitante")
    .max(120, "Máximo de 120 caracteres"),
  company: optionalText(120, "Máximo de 120 caracteres"),
  email: z
    .string()
    .trim()
    .max(160, "Máximo de 160 caracteres")
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(10, "Informe um telefone válido com DDD")
    .max(20, "Máximo de 20 caracteres"),
  whatsapp: optionalText(20, "Máximo de 20 caracteres"),
  city: optionalText(80, "Máximo de 80 caracteres"),
  state: optionalText(2, "Utilize a sigla do Estado"),

  /* oportunidade */
  product: z
    .string()
    .trim()
    .min(3, "Informe o produto ou serviço de interesse")
    .max(140, "Máximo de 140 caracteres"),
  description: optionalText(800, "Máximo de 800 caracteres"),
  installationPlace: optionalText(160, "Máximo de 160 caracteres"),
  notes: optionalText(400, "Máximo de 400 caracteres"),
  origin: z.enum(["landing_page", "site", "whatsapp", "manual", "integracao", "outro"]),
  priority: z.enum(["baixa", "normal", "alta", "urgente"]),

  /* atribuição imediata (somente com permissão) */
  assignToSellerId: z.string().optional(),
});

export type LeadFormValues = z.input<typeof leadFormSchema>;

/** Registro de contato realizado. */
export const leadContactSchema = z.object({
  channel: z.enum(["ligacao", "whatsapp", "email", "reuniao", "visita", "outro"]),
  result: z.enum([
    "contato_realizado",
    "sem_resposta",
    "aguardando_informacoes",
    "solicitou_retorno",
    "enviara_documentos",
    "sem_interesse",
    "oportunidade_qualificada",
    "outro",
  ]),
  notes: z
    .string()
    .trim()
    .min(3, "Descreva o retorno do contato")
    .max(800, "Máximo de 800 caracteres"),
  nextStep: optionalText(300, "Máximo de 300 caracteres"),
  /** Reagendamento opcional criado junto com o contato. */
  scheduleNext: z.boolean(),
  nextScheduleAt: z.string().optional().or(z.literal("")),
  nextScheduleDescription: optionalText(300, "Máximo de 300 caracteres"),
});

export type LeadContactFormValues = z.input<typeof leadContactSchema>;

/** Agendamento comercial avulso. */
export const leadScheduleSchema = z.object({
  scheduledFor: z.string().min(1, "Informe a data e o horário"),
  description: z
    .string()
    .trim()
    .min(3, "Descreva o objetivo do contato")
    .max(300, "Máximo de 300 caracteres"),
});

export type LeadScheduleFormValues = z.input<typeof leadScheduleSchema>;

/** Edição de compromisso existente na agenda do Lead. */
export const leadScheduleEditSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe o título do compromisso")
    .max(120, "Máximo de 120 caracteres"),
  scheduledFor: z.string().min(1, "Informe a data e o horário"),
  description: z
    .string()
    .trim()
    .min(3, "Descreva o objetivo do contato")
    .max(300, "Máximo de 300 caracteres"),
  ownerId: z.string().min(1, "Selecione o responsável"),
  status: z.enum(["pendente", "concluido", "cancelado", "expirado"]),
});

export type LeadScheduleEditFormValues = z.input<typeof leadScheduleEditSchema>;

/** Nota interna. */
export const leadNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Escreva a nota interna")
    .max(1000, "Máximo de 1000 caracteres"),
});

export type LeadNoteFormValues = z.input<typeof leadNoteSchema>;

/** Arquivo real vinculado ao Lead (armazenamento local em IndexedDB). */
export const LEAD_FILE_MAX_SIZE_IN_BYTES = 10 * 1024 * 1024;

export const leadFileSchema = z.object({
  file: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "Selecione um arquivo",
    )
    .refine((file) => file.size > 0, "O arquivo está vazio")
    .refine((file) => file.size <= LEAD_FILE_MAX_SIZE_IN_BYTES, "Máximo de 10 MB por arquivo"),
  classification: z.string().min(1, "Selecione a classificação"),
});

export type LeadFileFormValues = z.input<typeof leadFileSchema>;

/** Atribuição direta pelo gestor. */
export const leadDirectAssignmentSchema = z.object({
  sellerId: z.string().min(1, "Selecione o vendedor"),
  firstContactHours: z
    .number()
    .int("Utilize horas inteiras")
    .min(1, "Mínimo de 1 hora")
    .max(168, "Máximo de 168 horas"),
  priority: z.enum(["baixa", "normal", "alta", "urgente"]),
  observation: optionalText(400, "Máximo de 400 caracteres"),
});

export type LeadDirectAssignmentValues = z.input<typeof leadDirectAssignmentSchema>;

/** Recusa da solicitação — justificativa obrigatória. */
export const leadRejectionSchema = z.object({
  justification: z
    .string()
    .trim()
    .min(10, "Descreva o motivo da recusa")
    .max(400, "Máximo de 400 caracteres"),
});

export type LeadRejectionValues = z.input<typeof leadRejectionSchema>;

/** Encerramento (perdido ou descartado). */
export const leadClosingSchema = z.object({
  reason: z.string().trim().min(5, "Descreva o motivo").max(300, "Máximo de 300 caracteres"),
});

export type LeadClosingValues = z.input<typeof leadClosingSchema>;
