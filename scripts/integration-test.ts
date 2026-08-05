/**
 * Teste de integração da Sprint 03.2 — executado contra PostgreSQL real.
 *
 * Cobre as Fases 2, 3 e 4 diretamente nos módulos do servidor:
 *   - autenticação (hash argon2id, sessão, revogação);
 *   - persistência real do agregado Lead (criar, contato, nota, agenda);
 *   - fluxo de solicitação/aprovação com dois atores e permissões;
 *   - arquivos reais (storage físico + caminho relativo no banco);
 *   - auditoria e idempotência do seed.
 *
 * Execução: npx tsx scripts/integration-test.ts
 */
import fs from "node:fs";
import path from "node:path";

import { MASTER_USER_EMAIL } from "@/features/users/data/masterUser";

import { buildCommercialActor, assertLeadPermission } from "../src/server/auth/actor";
import { verifyPassword, hashPassword } from "../src/server/auth/password";
import { createSession, resolveSession, revokeSession } from "../src/server/auth/sessionService";
import { ensureSeed } from "../src/server/db/seed";
import { getStorageDir } from "../src/server/env";
import { findUserByEmail, getUserPasswordHash } from "../src/server/repositories/adminRepositories";
import { loadAuditEvents } from "../src/server/repositories/auditRepository";
import { getDb } from "../src/server/db/client";
import { leadFiles } from "../src/server/db/schema";
import { eq } from "drizzle-orm";
import * as leadService from "../src/server/services/leadService.server";
import { createUser } from "../src/server/services/userService.server";

let failures = 0;
function check(label: string, condition: boolean, detail = ""): void {
  if (condition) {
    console.log(`  ok  ${label}`);
  } else {
    failures += 1;
    console.error(`FALHA ${label} ${detail}`);
  }
}

const leadInput = {
  requester: {
    name: "Maria Silva",
    company: "Indústria Teste Ltda",
    email: "maria@industria.com.br",
    phone: "11 4002-8922",
    whatsapp: "11 94002-8922",
    city: "São Paulo",
    state: "SP",
  },
  interest: {
    product: "CLP industrial",
    description: "Automação de linha de envase",
    installationPlace: "Planta 2",
    notes: "Urgência para o próximo trimestre",
  },
  origin: "site" as const,
  priority: "alta" as const,
};

async function main(): Promise<void> {
  console.log("== Fase 3 — Autenticação real ==");

  const master = await findUserByEmail(MASTER_USER_EMAIL);
  check("usuário master existe no PostgreSQL", master !== undefined);
  if (!master) return;

  const hash = await getUserPasswordHash(master.id);
  check("hash argon2id persistido", !!hash && hash.startsWith("$argon2id$"));
  check("senha correta verifica", await verifyPassword(hash!, "862466"));
  check("senha incorreta rejeita", !(await verifyPassword(hash!, "errada")));
  check("hash de senhas iguais difere (sal aleatório)", (await hashPassword("862466")) !== hash);

  const session = await createSession(master.id);
  check("token de sessão opaco (64 hex)", /^[0-9a-f]{64}$/.test(session.token));
  const resolved = await resolveSession(session.token);
  check("sessão resolve o usuário", resolved?.user.id === master.id);
  check("token desconhecido não resolve", (await resolveSession("0".repeat(64))) === null);
  await revokeSession(session.token);
  check("sessão revogada não resolve", (await resolveSession(session.token)) === null);

  console.log("== Fase 2 — Persistência real (Lead) ==");

  const manager = buildCommercialActor(master);
  check("master é gestor comercial", manager.isManager);

  const created = await leadService.createLead(leadInput, manager);
  check("lead criado com código LD", /^LD\d{7}$/.test(created.code), created.code);
  check("histórico registra criação", created.history.length > 0);

  const withContact = await leadService.registerContact(created.id, manager, {
    channel: "ligacao",
    result: "contato_realizado",
    notes: "Contato inicial realizado com sucesso.",
  });
  check("contato persistido", withContact.contacts.length === 1);

  const withNote = await leadService.addNote(
    created.id,
    manager,
    "Cliente pediu retorno na sexta.",
  );
  check("nota persistida", withNote.notes.length === 1);

  const withSchedule = await leadService.scheduleContact(created.id, manager, {
    scheduledFor: new Date(Date.now() + 86_400_000).toISOString(),
    description: "Retornar ligação",
  });
  check("agendamento persistido", withSchedule.schedules.length === 1);

  const listed = await leadService.listAllLeads({});
  check(
    "listagem lê do PostgreSQL",
    listed.items.some((lead) => lead.id === created.id),
  );

  const reloaded = await leadService.getLead(created.id);
  check(
    "agregado remontado (contato+nota+agenda)",
    !!reloaded &&
      reloaded.contacts.length === 1 &&
      reloaded.notes.length === 1 &&
      reloaded.schedules.length === 1,
  );

  console.log("== Fluxo com dois atores e permissões ==");

  const { user: seller, temporaryPassword } = await createUser(
    {
      name: "Vendedor Teste",
      email: "vendedor.teste@brasilab.com.br",
      phone: "",
      registration: "BRL-T001",
      position: "Vendedor",
      groupCode: "comercial",
      profileId: "PRF-003",
      status: "ativo",
      specialPermissions: [],
    },
    { actorId: master.id, actorName: master.name, actorGroup: master.groupCode },
  );
  check("vendedor criado com senha temporária", temporaryPassword.length >= 8);

  const sellerActor = buildCommercialActor(seller);
  check("vendedor não é gestor", !sellerActor.isManager);

  let denied = false;
  try {
    assertLeadPermission(sellerActor, "aprovarAtribuicao");
  } catch {
    denied = true;
  }
  check("servidor nega aprovação a vendedor", denied);

  const requested = await leadService.requestLead(created.id, sellerActor);
  check("solicitação registrada", requested.request?.sellerId === seller.id);

  const approved = await leadService.approveRequest(created.id, manager);
  check("gestor aprova e atribui", approved.ownerId === seller.id);

  const mine = await leadService.listMyLeads(seller.id, {});
  check(
    "listagem do vendedor mostra o lead",
    mine.items.some((lead) => lead.id === created.id),
  );

  console.log("== Fase 4 — Arquivos reais ==");

  const pdfBytes = Buffer.from("%PDF-1.4 teste de integracao brasilab\n%%EOF");
  const withFile = await leadService.addFile(created.id, manager, {
    name: "memorial-descritivo.pdf",
    classification: "Memorial",
    content: new Blob([pdfBytes], { type: "application/pdf" }),
  });
  check("arquivo anexado ao lead", withFile.files.length === 1);

  const fileRow = withFile.files[0]!;
  check(
    "id de arquivo é UUID",
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(fileRow.id),
  );

  const db = getDb();
  const rows = await db.select().from(leadFiles).where(eq(leadFiles.id, fileRow.id));
  const storagePath = rows[0]?.storagePath ?? "";
  check(
    "banco guarda caminho RELATIVO leads/<code>/arquivos/<uuid>.pdf",
    storagePath === `leads/${created.code}/arquivos/${fileRow.id}.pdf`,
    storagePath,
  );
  check("nenhum caminho absoluto no banco", !path.isAbsolute(storagePath));

  const absolute = path.join(getStorageDir(), storagePath);
  check("binário gravado no storage físico", fs.existsSync(absolute));
  check(
    "conteúdo íntegro no disco",
    fs.existsSync(absolute) && fs.readFileSync(absolute).equals(pdfBytes),
  );

  const withoutFile = await leadService.removeFile(created.id, manager, fileRow.id);
  check("metadado removido do lead", withoutFile.files.length === 0);
  check("binário removido do storage", !fs.existsSync(absolute));

  console.log("== Auditoria e seed ==");

  const events = await loadAuditEvents();
  check("eventos de auditoria gravados", events.length >= 8, String(events.length));
  check(
    "sequência AUD- contínua",
    events.every((event) => /^AUD-\d{4}$/.test(event.id)),
  );

  const secondSeed = await ensureSeed();
  check("seed idempotente (nada alterado)", secondSeed.inserted === false);

  console.log(
    failures === 0
      ? "\nINTEGRAÇÃO: todos os testes passaram."
      : `\nINTEGRAÇÃO: ${failures} teste(s) falharam.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("ERRO FATAL", error);
  process.exit(1);
});
