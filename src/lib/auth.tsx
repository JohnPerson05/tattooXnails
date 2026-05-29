"use client";
// Admin auth context.
//
// Calls POST /api/auth/login (Next.js route) which verifies credentials against
// the Neon `admins` table and returns a signed JWT. The token is stored in
// localStorage and attached to admin API calls by ApiAdapter.
//
// For higher security later, move the token to an httpOnly cookie and add rate
// limiting on the login route.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SESSION_KEY = "owshie-celeste-admin-session";
const TOKEN_KEY = "owshie-celeste-admin-token";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  email: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = window.localStorage.getItem(SESSION_KEY);
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (session && token) setEmail(session);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (inputEmail: string, password: string) => {
    const normalized = inputEmail.trim().toLowerCase();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, password }),
      });
      if (!res.ok) {
        return { ok: false, error: "Invalid email or password" };
      }
      const { token } = (await res.json()) as { token: string };
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(SESSION_KEY, normalized);
      setEmail(normalized);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach the server" };
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    setEmail(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: !!email, loading, login, logout, email }),
    [email, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
