import { eq } from "drizzle-orm";

import type {
  Lead,
  LeadAssignmentRequest,
  LeadContact,
  LeadFile,
  LeadHistoryEntry,
  LeadNote,
  LeadSchedule,
} from "@/features/leads/types";

import { getDb, schema } from "../db/client";
import { maxSequence } from "./auditRepository";

const { leads, leadRequests, leadSchedules, leadContacts, leadNotes, leadFiles, leadHistory } =
  schema;

/**
 * Repositório do agregado Lead (Sprint 03.2).
 *
 * O domínio sempre manipula o Lead por inteiro (com agenda, contatos, notas,
 * arquivos e histórico), então o repositório carrega e salva o agregado
 * completo em transação única. Acesso serializado por um mutex em memória
 * (processo único do servidor), garantindo que leituras e escritas não se
 * intercalem — mesmo comportamento determinístico da base anterior.
 */

const iso = (value: Date): string => value.toISOString();
const isoOrNull = (value: Date | null): string | null => (value ? value.toISOString() : null);

/* ------------------------------------------------------------ mapeamento */

function toDomain(
  leadRow: typeof leads.$inferSelect,
  children: {
    request?: typeof leadRequests.$inferSelect;
    schedules: (typeof leadSchedules.$inferSelect)[];
    contacts: (typeof leadContacts.$inferSelect)[];
    notes: (typeof leadNotes.$inferSelect)[];
    files: (typeof leadFiles.$inferSelect)[];
    history: (typeof leadHistory.$inferSelect)[];
  },
): Lead {
  const byOccurredAtThenId = <T extends { id: string }>(rows: T[], dateOf: (row: T) => string) =>
    [...rows].sort((a, b) => dateOf(a).localeCompare(dateOf(b)) || a.id.localeCompare(b.id));

  const request: LeadAssignmentRequest | null = children.request
    ? {
        id: children.request.id,
        leadId: children.request.leadId,
        sellerId: children.request.sellerId,
        sellerName: children.request.sellerName,
        requestedAt: iso(children.request.requestedAt),
        deadlineAt: iso(children.request.deadlineAt),
        status: children.request.status as LeadAssignmentRequest["status"],
        decidedAt: isoOrNull(children.request.decidedAt),
        managerId: children.request.managerId,
        managerName: children.request.managerName,
        justification: children.request.justification,
      }
    : null;

  const schedules: LeadSchedule[] = byOccurredAtThenId(children.schedules, (row) =>
    iso(row.createdAt),
  ).map((row) => ({
    id: row.id,
    leadId: row.leadId,
    title: row.title,
    description: row.description,
    scheduledFor: iso(row.scheduledFor),
    status: row.status as LeadSchedule["status"],
    isFirstContact: row.isFirstContact,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    createdAt: iso(row.createdAt),
  }));

  const contacts: LeadContact[] = byOccurredAtThenId(children.contacts, (row) =>
    iso(row.occurredAt),
  ).map((row) => ({
    id: row.id,
    channel: row.channel as LeadContact["channel"],
    result: row.result as LeadContact["result"],
    occurredAt: iso(row.occurredAt),
    notes: row.notes,
    nextStep: row.nextStep,
    authorId: row.authorId,
    authorName: row.authorName,
  }));

  const notes: LeadNote[] = byOccurredAtThenId(children.notes, (row) => iso(row.createdAt)).map(
    (row) => ({
      id: row.id,
      content: row.content,
      authorId: row.authorId,
      authorName: row.authorName,
      createdAt: iso(row.createdAt),
      updatedAt: isoOrNull(row.updatedAt),
      visibility: "interna",
    }),
  );

  const files: LeadFile[] = byOccurredAtThenId(children.files, (row) => iso(row.uploadedAt)).map(
    (row) => ({
      id: row.id,
      name: row.name,
      classification: row.classification,
      extension: row.extension,
      sizeInBytes: row.sizeInBytes,
      uploadedAt: iso(row.uploadedAt),
      authorId: row.authorId,
      authorName: row.authorName,
    }),
  );

  const history: LeadHistoryEntry[] = byOccurredAtThenId(children.history, (row) =>
    iso(row.occurredAt),
  ).map((row) => ({
    id: row.id,
    event: row.event,
    description: row.description,
    occurredAt: iso(row.occurredAt),
    actorId: row.actorId,
    actorName: row.actorName,
    origin: row.origin as LeadHistoryEntry["origin"],
  }));

  return {
    id: leadRow.id,
    code: leadRow.code,
    status: leadRow.status as Lead["status"],
    situation: leadRow.situation as Lead["situation"],
    origin: leadRow.origin as Lead["origin"],
    priority: leadRow.priority as Lead["priority"],
    requester: leadRow.requester,
    interest: leadRow.interest,
    createdAt: iso(leadRow.createdAt),
    ownerId: leadRow.ownerId,
    ownerName: leadRow.ownerName,
    assignedAt: isoOrNull(leadRow.assignedAt),
    managerId: leadRow.managerId,
    managerName: leadRow.managerName,
    request,
    schedules,
    contacts,
    notes,
    files,
    history,
    proposalRef: leadRow.proposalRef,
    closingReason: leadRow.closingReason,
  };
}

/* --------------------------------------------------------------- leitura */

export async function loadLeads(): Promise<Lead[]> {
  const db = getDb();
  const leadRows = await db.select().from(leads);
  if (leadRows.length === 0) return [];

  const [requestRows, scheduleRows, contactRows, noteRows, fileRows, historyRows] =
    await Promise.all([
      db.select().from(leadRequests),
      db.select().from(leadSchedules),
      db.select().from(leadContacts),
      db.select().from(leadNotes),
      db.select().from(leadFiles),
      db.select().from(leadHistory),
    ]);

  const requestByLead = new Map(requestRows.map((row) => [row.leadId, row]));
  const groupByLead = <T extends { leadId: string }>(rows: T[]) => {
    const map = new Map<string, T[]>();
    for (const row of rows) {
      const list = map.get(row.leadId) ?? [];
      list.push(row);
      map.set(row.leadId, list);
    }
    return map;
  };
  const schedulesByLead = groupByLead(scheduleRows);
  const contactsByLead = groupByLead(contactRows);
  const notesByLead = groupByLead(noteRows);
  const filesByLead = groupByLead(fileRows);
  const historyByLead = groupByLead(historyRows);

  return leadRows
    .map((row) =>
      toDomain(row, {
        ...(requestByLead.has(row.id) ? { request: requestByLead.get(row.id)! } : {}),
        schedules: schedulesByLead.get(row.id) ?? [],
        contacts: contactsByLead.get(row.id) ?? [],
        notes: notesByLead.get(row.id) ?? [],
        files: filesByLead.get(row.id) ?? [],
        history: historyByLead.get(row.id) ?? [],
      }),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}

/* -------------------------------------------------------------- gravação */

/** Salva o agregado completo em transação única (upsert + filhos substituídos). */
export async function saveLead(lead: Lead): Promise<void> {
  const db = getDb();

  await db.transaction(async (tx) => {
    await tx
      .insert(leads)
      .values({
        id: lead.id,
        code: lead.code,
        status: lead.status,
        situation: lead.situation,
        origin: lead.origin,
        priority: lead.priority,
        requester: lead.requester,
        interest: lead.interest,
        ownerId: lead.ownerId,
        ownerName: lead.ownerName,
        assignedAt: lead.assignedAt ? new Date(lead.assignedAt) : null,
        managerId: lead.managerId,
        managerName: lead.managerName,
        proposalRef: lead.proposalRef,
        closingReason: lead.closingReason,
        createdAt: new Date(lead.createdAt),
      })
      .onConflictDoUpdate({
        target: leads.id,
        set: {
          status: lead.status,
          situation: lead.situation,
          origin: lead.origin,
          priority: lead.priority,
          requester: lead.requester,
          interest: lead.interest,
          ownerId: lead.ownerId,
          ownerName: lead.ownerName,
          assignedAt: lead.assignedAt ? new Date(lead.assignedAt) : null,
          managerId: lead.managerId,
          managerName: lead.managerName,
          proposalRef: lead.proposalRef,
          closingReason: lead.closingReason,
        },
      });

    if (lead.request) {
      await tx
        .insert(leadRequests)
        .values({
          id: lead.request.id,
          leadId: lead.id,
          sellerId: lead.request.sellerId,
          sellerName: lead.request.sellerName,
          requestedAt: new Date(lead.request.requestedAt),
          deadlineAt: new Date(lead.request.deadlineAt),
          status: lead.request.status,
          decidedAt: lead.request.decidedAt ? new Date(lead.request.decidedAt) : null,
          managerId: lead.request.managerId,
          managerName: lead.request.managerName,
          justification: lead.request.justification,
        })
        .onConflictDoUpdate({
          target: leadRequests.leadId,
          set: {
            sellerId: lead.request.sellerId,
            sellerName: lead.request.sellerName,
            requestedAt: new Date(lead.request.requestedAt),
            deadlineAt: new Date(lead.request.deadlineAt),
            status: lead.request.status,
            decidedAt: lead.request.decidedAt ? new Date(lead.request.decidedAt) : null,
            managerId: lead.request.managerId,
            managerName: lead.request.managerName,
            justification: lead.request.justification,
          },
        });
    } else {
      await tx.delete(leadRequests).where(eq(leadRequests.leadId, lead.id));
    }

    await tx.delete(leadSchedules).where(eq(leadSchedules.leadId, lead.id));
    if (lead.schedules.length > 0) {
      await tx.insert(leadSchedules).values(
        lead.schedules.map((schedule) => ({
          id: schedule.id,
          leadId: lead.id,
          title: schedule.title,
          description: schedule.description,
          scheduledFor: new Date(schedule.scheduledFor),
          status: schedule.status,
          isFirstContact: schedule.isFirstContact,
          ownerId: schedule.ownerId,
          ownerName: schedule.ownerName,
          createdAt: new Date(schedule.createdAt),
        })),
      );
    }

    await tx.delete(leadContacts).where(eq(leadContacts.leadId, lead.id));
    if (lead.contacts.length > 0) {
      await tx.insert(leadContacts).values(
        lead.contacts.map((contact) => ({
          id: contact.id,
          leadId: lead.id,
          channel: contact.channel,
          result: contact.result,
          occurredAt: new Date(contact.occurredAt),
          notes: contact.notes,
          nextStep: contact.nextStep,
          authorId: contact.authorId,
          authorName: contact.authorName,
        })),
      );
    }

    await tx.delete(leadNotes).where(eq(leadNotes.leadId, lead.id));
    if (lead.notes.length > 0) {
      await tx.insert(leadNotes).values(
        lead.notes.map((note) => ({
          id: note.id,
          leadId: lead.id,
          content: note.content,
          authorId: note.authorId,
          authorName: note.authorName,
          createdAt: new Date(note.createdAt),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : null,
        })),
      );
    }

    await tx.delete(leadFiles).where(eq(leadFiles.leadId, lead.id));
    if (lead.files.length > 0) {
      await tx.insert(leadFiles).values(
        lead.files.map((file) => ({
          id: file.id,
          leadId: lead.id,
          name: file.name,
          classification: file.classification,
          extension: file.extension,
          sizeInBytes: file.sizeInBytes,
          storagePath: storagePathOf(file, lead.code),
          uploadedAt: new Date(file.uploadedAt),
          authorId: file.authorId,
          authorName: file.authorName,
        })),
      );
    }

    await tx.delete(leadHistory).where(eq(leadHistory.leadId, lead.id));
    if (lead.history.length > 0) {
      await tx.insert(leadHistory).values(
        lead.history.map((item) => ({
          id: item.id,
          leadId: lead.id,
          event: item.event,
          description: item.description,
          occurredAt: new Date(item.occurredAt),
          actorId: item.actorId,
          actorName: item.actorName,
          origin: item.origin,
        })),
      );
    }
  });
}

/* --------------------------------------------- caminho físico dos arquivos */

/**
 * Caminho RELATIVO gravado no banco (condicional nº 5), no padrão
 * `leads/LD2600001/arquivos/<uuid>.pdf` — nunca contém o diretório
 * absoluto do storage.
 */
export function storagePathOf(file: LeadFile, leadCode: string): string {
  const extension = file.extension.toLowerCase();
  return `leads/${leadCode}/arquivos/${file.id}.${extension}`;
}

/* ------------------------------------------- sequências e store serializada */

export interface LeadSequences {
  lead: number;
  history: number;
  schedule: number;
  contact: number;
  note: number;
  request: number;
}

/**
 * Sequências derivadas do estado persistido (nunca reiniciam nem colidem).
 * Arquivos usam UUID (padrão do caminho físico) e não precisam de sequência.
 */
export function computeSequences(store: Lead[]): LeadSequences {
  const suffix = (id: string) => {
    const match = /(\d+)$/.exec(id);
    return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
  };
  const maxOf = (ids: string[]) => ids.reduce((max, id) => Math.max(max, suffix(id)), 0);

  return {
    lead: maxOf(store.map((lead) => lead.id)),
    history: maxOf(store.flatMap((lead) => lead.history.map((item) => item.id))),
    schedule: maxOf(store.flatMap((lead) => lead.schedules.map((item) => item.id))),
    contact: maxOf(store.flatMap((lead) => lead.contacts.map((item) => item.id))),
    note: maxOf(store.flatMap((lead) => lead.notes.map((item) => item.id))),
    request: maxOf(store.map((lead) => lead.request?.id ?? "")),
  };
}

export interface LeadStoreContext {
  store: Lead[];
  sequences: LeadSequences;
}

let queue: Promise<unknown> = Promise.resolve();

/**
 * Executa uma operação sobre a base de Leads com acesso exclusivo:
 * carrega o estado persistido, executa a operação e grava APENAS os
 * agregados alterados (comparação de snapshot). Leituras sem alteração
 * não geram escrita alguma.
 */
export async function withLeadStore<T>(
  operation: (context: LeadStoreContext) => T | Promise<T>,
): Promise<T> {
  const run = queue.then(async () => {
    const store = await loadLeads();
    const sequences = computeSequences(store);
    const snapshots = new Map(store.map((lead) => [lead.id, JSON.stringify(lead)]));

    const result = await operation({ store, sequences });

    for (const lead of store) {
      const snapshot = snapshots.get(lead.id);
      if (snapshot === undefined || snapshot !== JSON.stringify(lead)) {
        await saveLead(lead);
      }
    }

    return result;
  });

  queue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export { maxSequence };
