import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import type {
  PermissionMatrix,
  PermissionOverride,
  SpecialPermissionCode,
} from "@/features/permissions/types";
import type { LeadInterest, LeadRequester } from "@/features/leads/types";

/**
 * Schema oficial do PostgreSQL (Sprint 03.2 — Infraestrutura).
 *
 * As tabelas espelham os tipos de domínio já existentes em src/features —
 * nenhuma regra de negócio é alterada. Entidades planas (usuários, grupos,
 * perfis, sessões, auditoria) são linhas normalizadas; o agregado Lead
 * possui tabelas-filhas para cada coleção interna, sempre carregado e
 * salvo como um todo (transação única), exatamente como o domínio opera.
 *
 * Migrations são geradas por `npm run db:generate` (drizzle-kit) e aplicadas
 * por `npm run db:migrate` — nunca apagam nem recriam tabelas
 * automaticamente (condicional nº 6).
 */

/* ---------------------------------------------------------- administração */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  /** Hash argon2id — a senha em texto puro jamais é persistida. */
  passwordHash: text("password_hash").notNull(),
  phone: text("phone").notNull().default(""),
  registration: text("registration").notNull().default(""),
  position: text("position").notNull().default(""),
  groupCode: text("group_code").notNull(),
  profileId: text("profile_id").notNull(),
  status: text("status").notNull().default("ativo"),
  notes: text("notes"),
  specialPermissions: jsonb("special_permissions")
    .$type<SpecialPermissionCode[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  lastAccessAt: timestamp("last_access_at", { withTimezone: true, mode: "date" }),
});

export const groups = pgTable("groups", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  manager: text("manager").notNull().default(""),
  email: text("email").notNull().default(""),
  active: boolean("active").notNull().default(true),
  modules: jsonb("modules").$type<string[]>().notNull().default([]),
  permissions: jsonb("permissions").$type<PermissionMatrix>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  groupCode: text("group_code").notNull(),
  level: integer("level").notNull().default(1),
  active: boolean("active").notNull().default(true),
  override: jsonb("override").$type<PermissionOverride>().notNull().default({}),
  specialPermissions: jsonb("special_permissions")
    .$type<SpecialPermissionCode[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});

/* -------------------------------------------------------------- sessões */

export const sessions = pgTable("sessions", {
  /** SHA-256 do token entregue ao navegador — o token puro nunca é gravado. */
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
});

/* ------------------------------------------------------------- auditoria */

export const auditEvents = pgTable("audit_events", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  entity: text("entity").notNull(),
  action: text("action").notNull(),
  entityId: text("entity_id").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull().default("informativo"),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  actorGroup: text("actor_group").notNull(),
  origin: text("origin").notNull().default("interface"),
});

/* ----------------------------------------------------------------- leads */

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  status: text("status").notNull(),
  situation: text("situation").notNull(),
  origin: text("origin").notNull(),
  priority: text("priority").notNull(),
  requester: jsonb("requester").$type<LeadRequester>().notNull(),
  interest: jsonb("interest").$type<LeadInterest>().notNull(),
  ownerId: text("owner_id"),
  ownerName: text("owner_name"),
  assignedAt: timestamp("assigned_at", { withTimezone: true, mode: "date" }),
  managerId: text("manager_id"),
  managerName: text("manager_name"),
  proposalRef: text("proposal_ref"),
  closingReason: text("closing_reason"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});

/** Solicitação de atribuição vigente (no máximo uma por Lead, como no domínio). */
export const leadRequests = pgTable("lead_requests", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .unique()
    .references(() => leads.id),
  sellerId: text("seller_id").notNull(),
  sellerName: text("seller_name").notNull(),
  requestedAt: timestamp("requested_at", { withTimezone: true, mode: "date" }).notNull(),
  deadlineAt: timestamp("deadline_at", { withTimezone: true, mode: "date" }).notNull(),
  status: text("status").notNull(),
  decidedAt: timestamp("decided_at", { withTimezone: true, mode: "date" }),
  managerId: text("manager_id"),
  managerName: text("manager_name"),
  justification: text("justification"),
});

export const leadSchedules = pgTable("lead_schedules", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leads.id),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true, mode: "date" }).notNull(),
  status: text("status").notNull(),
  isFirstContact: boolean("is_first_contact").notNull().default(false),
  ownerId: text("owner_id").notNull().default(""),
  ownerName: text("owner_name").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const leadContacts = pgTable("lead_contacts", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leads.id),
  channel: text("channel").notNull(),
  result: text("result").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
  notes: text("notes").notNull().default(""),
  nextStep: text("next_step").notNull().default(""),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
});

export const leadNotes = pgTable("lead_notes", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leads.id),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
});

/**
 * Metadados do arquivo + caminho RELATIVO no storage (condicional nº 5).
 * O binário fica no disco (STORAGE_DIR) — nunca no banco, nunca em Base64.
 */
export const leadFiles = pgTable("lead_files", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leads.id),
  name: text("name").notNull(),
  classification: text("classification").notNull(),
  extension: text("extension").notNull(),
  sizeInBytes: integer("size_in_bytes").notNull(),
  /** Ex.: leads/LEAD-0001/arquivos/<uuid>.pdf — sempre relativo ao STORAGE_DIR. */
  storagePath: text("storage_path").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "date" }).notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
});

/** Histórico imutável do Lead — apenas inclusão (regra de negócio). */
export const leadHistory = pgTable("lead_history", {
  id: text("id").primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leads.id),
  event: text("event").notNull(),
  description: text("description").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  origin: text("origin").notNull().default("interface"),
});
