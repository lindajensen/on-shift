import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  role?: "worker" | "employer";
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/session-utgangen" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/hem" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
