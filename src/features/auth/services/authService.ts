import type { LoginFormValues } from "../schemas/authSchemas";

/**
 * Sessão temporária da Sprint 01.
 *
 * Decisão arquitetural: a Sprint 01 não integra Supabase Auth (previsto na
 * Stack Tecnológica) porque nenhum backend deve ser criado nesta etapa.
 * Todo o acesso ao estado de sessão passa por este service, de modo que a
 * troca pela integração real ocorrerá em um único ponto do código.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface AuthSession {
  user: AuthUser;
  issuedAt: number;
  expiresAt: number;
}

const STORAGE_KEY = "brasilab.session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 horas

function buildUser(email: string): AuthUser {
  const handle = email.split("@")[0] ?? "usuario";
  const name = handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    id: "temp-user",
    name: name || "Usuário Brasilab",
    email,
    role: "Administrador",
    initials: (name || "Usuário Brasilab")
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join(""),
  };
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session.expiresAt || session.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function signIn(values: LoginFormValues): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const now = Date.now();
  const session: AuthSession = {
    user: buildUser(values.email),
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function signOut(): Promise<void> {
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function requestPasswordRecovery(email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Estrutura preparada: o envio real será implementado com Supabase Auth.
  void email;
}
