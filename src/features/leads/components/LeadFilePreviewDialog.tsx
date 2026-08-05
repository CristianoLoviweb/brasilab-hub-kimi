import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  formatFileSize,
  getLeadFilePreviewKind,
  getLeadFileUrl,
} from "../services/leadFileStorage";
import type { LeadFile } from "../types";

/**
 * Pré-visualização de arquivos do Lead em modal.
 *
 * Imagens (JPG, JPEG, PNG, WEBP, GIF) e PDFs são renderizados diretamente a
 * partir da URL do servidor (GET /api/leads/arquivos/:id), que entrega o
 * binário em streaming com suporte a Range — sem Blob, sem Base64 e sem
 * URLs temporárias no navegador.
 */
export function LeadFilePreviewDialog({
  file,
  onClose,
  onDownload,
}: {
  /** Arquivo em visualização; `null` mantém o modal fechado. */
  file: LeadFile | null;
  onClose: () => void;
  onDownload: (file: LeadFile) => void;
}) {
  const previewKind = file ? getLeadFilePreviewKind(file.extension) : null;
  const fileUrl = file ? getLeadFileUrl(file.id) : null;

  return (
    <Dialog
      open={file !== null && previewKind !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-4xl">
        {file && fileUrl ? (
          <>
            <DialogHeader>
              <DialogTitle className="truncate">{file.name}</DialogTitle>
              <DialogDescription>
                {file.classification} · {formatFileSize(file.sizeInBytes)}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-muted/30">
              {previewKind === "image" ? (
                <div className="flex max-h-[65vh] items-center justify-center overflow-auto p-2">
                  <img src={fileUrl} alt={file.name} className="h-auto max-w-full object-contain" />
                </div>
              ) : previewKind === "pdf" ? (
                <iframe src={fileUrl} title={file.name} className="h-[65vh] w-full border-0" />
              ) : null}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button onClick={() => onDownload(file)}>
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
