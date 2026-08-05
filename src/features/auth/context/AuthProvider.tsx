import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  clearLegacySimulatedSessionKeys,
  readSession,
  signIn,
  signOut,
  type AuthSession,
  type AuthUser,
} from "../services/authService";
import type { LoginFormValues } from "../schemas/authSchemas";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** false enquanto a sessão persistida ainda não foi lida no cliente */
  isReady: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    // Remove as chaves nomeadas da autenticação simulada (condicional nº 4)
    // e resolve a sessão real no servidor.
    clearLegacySimulatedSessionKeys();
    readSession()
      .then((current) => {
        if (active) setSession(current);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (values: LoginFormValues) => {
    setSession(await signIn(values));
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isReady,
      login,
      logout,
    }),
    [session, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
