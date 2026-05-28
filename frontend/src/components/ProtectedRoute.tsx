import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import "../styles/ProtectedRoute.css";

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

  if (!user) {
    return (
      <section className="protected-route">
        <div className="section__inner">
          <h1>Logga in för att fortsätta</h1>
          <p>Du behöver ett konto för att se den här sidan.</p>
          <Link to="/logga-in" className="btn btn--primary">
            Logga in
          </Link>
        </div>
      </section>
    );
  }

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/session-utgangen" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/hem" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
