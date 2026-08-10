import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService, TOKEN_KEY } from "@/services/api";

export type User = {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  avatar?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone: string) => Promise<User>;
  logout: () => void;
};

const USER_KEY = "tpms_user";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session after hydration (localStorage is browser-only).
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as User);
    } catch {
      /* ignore corrupted storage */
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authService.login({ email, password });
      persist(data.token, data.user as User);
      return data.user as User;
    },
    [persist],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, phone: string) => {
      const data = await authService.register({ name, email, password, phone });
      persist(data.token, data.user as User);
      return data.user as User;
    },
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
