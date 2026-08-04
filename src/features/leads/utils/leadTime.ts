import {
  LEAD_DEADLINE_WARNING_HOURS,
} from "../constants/leadTiming";

/** Utilitários temporais do módulo — nenhum componente calcula prazos por conta própria. */

export type DeadlineTone = "success" | "warning" | "danger" | "neutral";

export interface DeadlineInfo {
  /** Milissegundos restantes (negativo quando vencido). */
  remainingMs: number;
  expired: boolean;
  label: string;
  tone: DeadlineTone;
}

function humanize(ms: number): string {
  const totalMinutes = Math.floor(Math.abs(ms) / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export function describeDeadline(deadlineIso: string, reference = Date.now()): DeadlineInfo {
  const remainingMs = new Date(deadlineIso).getTime() - reference;
  const expired = remainingMs <= 0;
  const warningMs = LEAD_DEADLINE_WARNING_HOURS * 60 * 60 * 1000;

  return {
    remainingMs,
    expired,
    label: expired ? `Vencido há ${humanize(remainingMs)}` : `Restam ${humanize(remainingMs)}`,
    tone: expired ? "danger" : remainingMs <= warningMs ? "warning" : "success",
  };
}

/** Tempo decorrido desde a entrada do Lead (tempo aguardando atendimento). */
export function describeElapsed(sinceIso: string, reference = Date.now()): string {
  const elapsed = reference - new Date(sinceIso).getTime();
  if (elapsed < 0) return "—";
  return humanize(elapsed);
}

export function isSameDay(isoDate: string, reference = new Date()): boolean {
  const date = new Date(isoDate);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}
