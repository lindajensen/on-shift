import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  role?: "worker" | "employer";
}

function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
