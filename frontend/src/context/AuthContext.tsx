import { createContext } from "react";
import { AuthUser } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
