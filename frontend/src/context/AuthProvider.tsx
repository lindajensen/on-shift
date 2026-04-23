import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { AuthUser } from "../types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return jwtDecode<AuthUser>(token);
    }
    return null;
  });

  const [isLoading] = useState(false);

  function login(token: string, user: AuthUser) {
    localStorage.setItem("token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
