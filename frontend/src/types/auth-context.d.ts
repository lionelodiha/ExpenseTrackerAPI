declare module "../context/AuthContext" {
  import React from "react";
  export interface Auth {
    user: unknown;
    login(email: string, password: string): Promise<unknown>;
    logout(): void;
    register(name: string, email: string, password: string): Promise<unknown>;
  }
  export const AuthProvider: React.FC<React.PropsWithChildren>;
  export function useAuth(): Auth;
}
