import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { detectLegacyLocalFiles, type LegacyLocalFilesReport } from "../services/legacyLocalFiles";
import { formatFileSize } from "../services/leadFileStorage";

/**
 * Aviso de dados locais legados (Sprint 03.2 — condicional nº 4).
 *
 * Executado uma vez por sessão autenticada: detecta arquivos da etapa em
 * que o storage era o IndexedDB do navegador e INFORMA o que encontrou.
 * Nada é migrado (os vínculos existiam apenas em memória) e NADA é
 * removido — a exclusão é manual e exclusivamente autorizada pelo usuário.
 */

/** Chave nomeada (individual) que registra a ciência do usuário. */
const DISMISS_KEY = "brasilab.legacy-files-notice-dismissed";

export function LegacyLocalFilesNotice() {
  const { isAuthenticated, isReady } = useAuth();
  const [report, setReport] = useState<LegacyLocalFilesReport | null>(null);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "true") return;
    } catch {
      // sem acesso ao localStorage — exibe o aviso mesmo assim
    }
    let active = true;
    detectLegacyLocalFiles().then((found) => {
      if (active && found) setReport(found);
    });
    return () => {
      active = false;
    };
  }, [isReady, isAuthenticated]);

  if (!report) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // sem acesso ao localStorage — apenas fecha
    }
    setReport(null);
  };

  return (
    <AlertDialog open onOpenChange={(open) => !open && dismiss()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dados do ambiente anterior encontrados</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              <p>
                Foram encontrados <strong>{report.count} arquivo(s)</strong> (
                {formatFileSize(report.totalBytes)}) no armazenamento local deste navegador,
                gravados pela versão anterior da plataforma (IndexedDB <code>brasilab-storage</code>
                ).
              </p>
              <p>
                Como os vínculos desses arquivos com os Leads existiam apenas na memória do ambiente
                simulado, <strong>não é possível migrá-los automaticamente</strong> para o servidor.
              </p>
              <p>
                <strong>Nada foi apagado.</strong> Se não houver nada a preservar, você pode remover
                esses dados manualmente quando desejar (Ferramentas do navegador → Armazenamento →
                IndexedDB → <code>brasilab-storage</code>).
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={dismiss}>Lembrar depois</AlertDialogCancel>
          <AlertDialogAction onClick={dismiss}>Entendi, não mostrar novamente</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
