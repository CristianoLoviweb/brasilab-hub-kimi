/**
 * Links de contato do Lead.
 *
 * WhatsApp Web e `mailto:` funcionam apenas como redirecionamento
 * (Sprint 03 — item 16 e 17). Nenhuma API oficial é utilizada e nenhum dado
 * além do necessário é exposto na URL.
 */

const DEFAULT_COUNTRY_CODE = "55";

/** Normaliza o telefone para o formato internacional aceito pelo WhatsApp. */
export function normalizePhone(value: string): string | null {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith(DEFAULT_COUNTRY_CODE) && digits.length >= 12) return digits;
  return `${DEFAULT_COUNTRY_CODE}${digits}`;
}

export function buildWhatsAppUrl(phone: string, message?: string): string | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${query}`;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test((value ?? "").trim());
}

export function buildMailtoUrl(email: string, subject: string, body?: string): string | null {
  if (!isValidEmail(email)) return null;

  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);

  return `mailto:${email.trim()}?${params.toString()}`;
}
