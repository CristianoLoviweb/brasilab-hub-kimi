CREATE TABLE "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"entity" text NOT NULL,
	"action" text NOT NULL,
	"entity_id" text NOT NULL,
	"description" text NOT NULL,
	"severity" text DEFAULT 'informativo' NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"actor_id" text NOT NULL,
	"actor_name" text NOT NULL,
	"actor_group" text NOT NULL,
	"origin" text DEFAULT 'interface' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"manager" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"modules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"channel" text NOT NULL,
	"result" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"next_step" text DEFAULT '' NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_files" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"name" text NOT NULL,
	"classification" text NOT NULL,
	"extension" text NOT NULL,
	"size_in_bytes" integer NOT NULL,
	"storage_path" text NOT NULL,
	"uploaded_at" timestamp with time zone NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_history" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"event" text NOT NULL,
	"description" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"actor_id" text NOT NULL,
	"actor_name" text NOT NULL,
	"origin" text DEFAULT 'interface' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lead_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"seller_name" text NOT NULL,
	"requested_at" timestamp with time zone NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"decided_at" timestamp with time zone,
	"manager_id" text,
	"manager_name" text,
	"justification" text,
	CONSTRAINT "lead_requests_lead_id_unique" UNIQUE("lead_id")
);
--> statement-breakpoint
CREATE TABLE "lead_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"is_first_contact" boolean DEFAULT false NOT NULL,
	"owner_id" text DEFAULT '' NOT NULL,
	"owner_name" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"status" text NOT NULL,
	"situation" text NOT NULL,
	"origin" text NOT NULL,
	"priority" text NOT NULL,
	"requester" jsonb NOT NULL,
	"interest" jsonb NOT NULL,
	"owner_id" text,
	"owner_name" text,
	"assigned_at" timestamp with time zone,
	"manager_id" text,
	"manager_name" text,
	"proposal_ref" text,
	"closing_reason" text,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "leads_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"group_code" text NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"override" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"special_permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"registration" text DEFAULT '' NOT NULL,
	"position" text DEFAULT '' NOT NULL,
	"group_code" text NOT NULL,
	"profile_id" text NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"notes" text,
	"special_permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"last_access_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "lead_contacts" ADD CONSTRAINT "lead_contacts_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_files" ADD CONSTRAINT "lead_files_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_history" ADD CONSTRAINT "lead_history_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_requests" ADD CONSTRAINT "lead_requests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_schedules" ADD CONSTRAINT "lead_schedules_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;