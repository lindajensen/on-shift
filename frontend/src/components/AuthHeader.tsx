import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getInitials } from "../utils/text";
import { LogOut, User2 } from "lucide-react";

import "../styles/AuthHeader.css";

function AuthHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    function handleClickOutside() {
      setIsMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user) return;

  const initials = user.name ? getInitials(user.name) : "";

  //TODO: Fix hover styling dropdown menu

  return (
    <>
      <header className="auth-header">
        <div className="auth-header__container">
          <nav className="auth-header__nav">
            <Link className="auth-header__logo" to="/">
              <span className="auth-header__logo-accent">on</span>Shift
            </Link>
            <div className="auth-header__avatar-wrapper">
              <div
                className="auth-header__avatar avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                {initials}
              </div>

              {isMenuOpen && (
                <div className="auth-header__menu">
                  <Link className="auth-header__menu-btn" to="/profil">
                    <User2 size={16} />
                    Min profil
                  </Link>
                  <div className="auth-header__menu-divider" />
                  <button
                    className="auth-header__menu-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logga ut
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default AuthHeader;
