import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Lock } from "lucide-react";

import "../styles/SessionExpiredPage.css";

function SessionExpiredPage() {
  const { logout } = useAuth();

  useEffect(() => {
    localStorage.removeItem("token");
    logout();
  }, [logout]);

  return (
    <section className="session-expired">
      <div className="session-expired__icon">
        <Lock size={32} aria-label="hidden" />
      </div>
      <h1 className="session-expired__title">Din session har gått ut</h1>
      <p className="session-expired__text">
        Du har blivit utloggad. Logga in igen för att fortsätta.
      </p>
      <Link to="/logga-in" className="btn btn--primary">
        Logga in
      </Link>
    </section>
  );
}

export default SessionExpiredPage;
