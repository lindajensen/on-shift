import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getInitials } from "../utils/text";

import "../styles/AuthHeader.css";

function AuthHeader() {
  const { user } = useAuth();

  if (!user) return;

  const initials = user.name ? getInitials(user.name) : "";

  //TODO: Avatar opens dropdown (my profile, logout)

  return (
    <header className="auth-header">
      <nav className="auth-header__nav">
        <Link className="auth-header__logo" to="/">
          <span className="auth-header__logo-accent">on</span>Shift
        </Link>
        <div className="auth-header__avatar avatar">{initials}</div>
      </nav>
    </header>
  );
}

export default AuthHeader;
