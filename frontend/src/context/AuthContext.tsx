import React, { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/auth-service";

type User = {
  id?: string;
  name?: string;
  nickname?: string;
  email?: string;
  profilePicture?: string;
  phone?: string;
  bio?: string;
  token?: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<any>;
  updateUser: (userData: Partial<User>) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Try to load user from localStorage
    const storedUser = localStorage.getItem("user");
    const token = authService.getToken();
    
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return token ? { token } : null;
      }
    }
    return token ? { token } : null;
  });

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    if (data.data?.auth) {
      const userData = {
        token: data.data.auth.token,
        id: data.data.auth.user?.id,
        name: data.data.auth.user?.name,
        nickname: data.data.auth.user?.nickname,
        email: data.data.auth.user?.email,
        profilePicture: data.data.auth.user?.profilePicture,
        phone: data.data.auth.user?.phone,
        bio: data.data.auth.user?.bio,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return data;
  };

  const logout = () => {
    authService.logoutClient();
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register({ name, email, password });
    return data;
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      const updated = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(() => ({ user, login, logout, register, updateUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
