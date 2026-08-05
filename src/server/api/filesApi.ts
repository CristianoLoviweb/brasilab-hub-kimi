import { Readable } from "node:stream";

import { eq } from "drizzle-orm";

import { LEAD_PERMISSIONS } from "@/features/leads/constants/leadPermissions";

import { assertLeadPermission, buildCommercialActor } from "../auth/actor";
import { resolveSession } from "../auth/sessionService";
import { getDb, schema } from "../db/client";
import { getMaxUploadBytes } from "../env";
import { addFile } from "../services/leadService.server";
import { createFileStream, statFileContent } from "../storage/fileStorage";
import { SESSION_COOKIE } from "../fns/context";

const { leadFiles } = schema;

/**
 * Rotas HTTP de arquivos do módulo de Leads (Sprint 03.2):
 *
 *   POST /api/leads/arquivos            upload multipart (nunca Base64)
 *   GET  /api/leads/arquivos/:id        visualização (inline) com Range
 *   GET  /api/leads/arquivos/:id?download=1  download com nome original
 *
 * Protegidas pela mesma sessão em cookie HttpOnly das Server Functions;
 * o ator e a permissão são derivados no servidor.
 */

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
  txt: "text/plain; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  json: "application/json",
  xml: "application/xml",
  zip: "application/zip",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

/** Proteção CSRF para o upload: Origem (quando presente) deve ser do próprio host. */
function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const originHost = new URL(origin).host;
  const requestHost = new URL(request.url).host;
  if (originHost !== requestHost) {
    throw new ApiError(403, "Origem não autorizada.");
  }
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function requireActor(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  const session = await resolveSession(token);
  if (!session || session.user.status !== "ativo") {
    throw new ApiError(401, "Sessão inválida ou expirada.");
  }
  return buildCommercialActor(session.user);
}

export async function handleFilesApi(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/leads/arquivos") {
      return await handleUpload(request);
    }

    const downloadMatch = /^\/api\/leads\/arquivos\/([\w-]+)$/.exec(url.pathname);
    if (request.method === "GET" && downloadMatch) {
      return await handleDownload(request, downloadMatch[1]!);
    }

    return json({ message: "Rota não encontrada." }, 404);
  } catch (error) {
    if (error instanceof ApiError) {
      return json({ message: error.message }, error.status);
    }
    console.error("[filesApi]", error);
    return json(
      { message: error instanceof Error ? error.message : "Erro interno ao processar arquivo." },
      500,
    );
  }
}

/* ------------------------------------------------------------------ upload */

async function handleUpload(request: Request): Promise<Response> {
  assertSameOrigin(request);
  const actor = await requireActor(request);
  assertLeadPermission(actor, LEAD_PERMISSIONS.adicionarArquivo);

  const form = await request.formData();
  const leadId = String(form.get("leadId") ?? "");
  const classification = String(form.get("classification") ?? "");
  const file = form.get("file");

  if (!leadId) throw new ApiError(400, "Lead não informado.");
  if (!classification.trim()) throw new ApiError(400, "Informe a classificação do arquivo.");
  if (!(file instanceof File)) throw new ApiError(400, "Selecione um arquivo.");
  if (file.size === 0) throw new ApiError(400, "O arquivo está vazio.");
  if (file.size > getMaxUploadBytes()) {
    throw new ApiError(400, "O arquivo excede o tamanho máximo permitido (10 MB).");
  }

  const lead = await addFile(leadId, actor, {
    name: file.name,
    classification: classification.trim(),
    content: file,
  });

  return json(lead, 201);
}

/* ---------------------------------------------------------------- download */

function contentDisposition(kind: "inline" | "attachment", filename: string): string {
  const fallback = filename.replace(/[^\w. -]/g, "_");
  const encoded = encodeURIComponent(filename).replace(/'/g, "%27");
  return `${kind}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

async function handleDownload(request: Request, fileId: string): Promise<Response> {
  await requireActor(request);

  const [row] = await getDb().select().from(leadFiles).where(eq(leadFiles.id, fileId)).limit(1);
  if (!row) throw new ApiError(404, "Arquivo não encontrado.");

  const info = await statFileContent(row.storagePath);
  if (!info) throw new ApiError(404, "Conteúdo não encontrado no storage do servidor.");

  const url = new URL(request.url);
  const asAttachment = url.searchParams.get("download") === "1";
  const contentType = MIME_BY_EXTENSION[row.extension.toLowerCase()] ?? "application/octet-stream";

  const headers = new Headers({
    "content-type": contentType,
    "content-disposition": contentDisposition(asAttachment ? "attachment" : "inline", row.name),
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
    "cache-control": "private, no-store",
  });

  // Suporte a Range (necessário para a navegação de PDFs no navegador).
  const range = request.headers.get("range");
  const rangeMatch = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;

  if (rangeMatch && (rangeMatch[1] || rangeMatch[2])) {
    let start = rangeMatch[1] ? Number.parseInt(rangeMatch[1], 10) : 0;
    let end = rangeMatch[2] ? Number.parseInt(rangeMatch[2], 10) : info.sizeInBytes - 1;

    if (!rangeMatch[1] && rangeMatch[2]) {
      // Forma "bytes=-N": últimos N bytes.
      start = Math.max(0, info.sizeInBytes - Number.parseInt(rangeMatch[2], 10));
      end = info.sizeInBytes - 1;
    }
    end = Math.min(end, info.sizeInBytes - 1);

    if (start > end || start >= info.sizeInBytes) {
      return new Response(null, {
        status: 416,
        headers: { "content-range": `bytes */${info.sizeInBytes}` },
      });
    }

    headers.set("content-range", `bytes ${start}-${end}/${info.sizeInBytes}`);
    headers.set("content-length", String(end - start + 1));

    const stream = Readable.toWeb(createFileStream(info.absolutePath, { start, end }));
    return new Response(stream as ReadableStream, { status: 206, headers });
  }

  headers.set("content-length", String(info.sizeInBytes));
  const stream = Readable.toWeb(createFileStream(info.absolutePath));
  return new Response(stream as ReadableStream, { status: 200, headers });
}
