import type { Lead } from "../types";

/**
 * Acesso aos arquivos do Lead (Sprint 03.2).
 *
 * Os binários ficam no storage físico do servidor (STORAGE_DIR) e são
 * servidos pelas rotas HTTP /api/leads/arquivos — o banco guarda apenas o
 * caminho relativo e os metadados. Nada em Base64 e nada em IndexedDB:
 * o navegador consome URLs do servidor, exatamente como consumirá em
 * produção.
 */

export interface LeadFileUploadInput {
  file: File;
  classification: string;
}

/**
 * Envia o arquivo ao servidor (multipart) e devolve o Lead atualizado —
 * mesmo resultado que a antiga operação addFile do service.
 */
export async function uploadLeadFile(leadId: string, input: LeadFileUploadInput): Promise<Lead> {
  const form = new FormData();
  form.set("leadId", leadId);
  form.set("classification", input.classification);
  form.set("file", input.file, input.file.name);

  const response = await fetch("/api/leads/arquivos", {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });

  if (!response.ok) {
    let message = "Não foi possível enviar o arquivo.";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // resposta não-JSON — mantém a mensagem padrão
    }
    throw new Error(message);
  }

  return (await response.json()) as Lead;
}

/**
 * URL do arquivo no servidor. Por padrão abre inline (visualização); com
 * `download: true` o servidor responde como anexo com o nome original.
 */
export function getLeadFileUrl(fileId: string, options?: { download?: boolean }): string {
  const base = `/api/leads/arquivos/${fileId}`;
  return options?.download ? `${base}?download=1` : base;
}

/* ------------------------------------------- pré-visualização no modal */

export const IMAGE_PREVIEW_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"] as const;
export const PDF_PREVIEW_EXTENSIONS = ["pdf"] as const;

export type LeadFilePreviewKind = "image" | "pdf";

/** Tipo de pré-visualização suportada — demais formatos: nova aba/download. */
export function getLeadFilePreviewKind(extension: string): LeadFilePreviewKind | null {
  const normalized = extension.toLowerCase();
  if ((IMAGE_PREVIEW_EXTENSIONS as readonly string[]).includes(normalized)) return "image";
  if ((PDF_PREVIEW_EXTENSIONS as readonly string[]).includes(normalized)) return "pdf";
  return null;
}

/** Formata o tamanho para exibição (ex.: "250 KB", "1,4 MB"). */
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  const sizeInKb = sizeInBytes / 1024;
  if (sizeInKb < 1024) {
    const rounded = sizeInKb >= 100 ? Math.round(sizeInKb) : sizeInKb.toFixed(1).replace(".", ",");
    return `${rounded} KB`;
  }
  const sizeInMb = sizeInKb / 1024;
  return `${sizeInMb.toFixed(1).replace(".", ",")} MB`;
}
