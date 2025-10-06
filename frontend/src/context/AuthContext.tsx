import React, { createContext, useContext, useMemo, useState } from "react";
import authService from "../services/authService"; // JS is fine; see shim below

type User = any; // swap with your real user shape when you’re ready

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() =>
    authService?.getCurrentUser?.() ?? null
  );

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(authService?.getCurrentUser?.() ?? null);
    return data;
  };

  const logout = () => {
    authService?.logout?.();
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    return data;
  };

  const value = useMemo(() => ({ user, login, logout, register }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
