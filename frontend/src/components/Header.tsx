import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Modal from "./modals/Modal";
import LoginModal from "./modals/LoginModal";

import "../styles/Header.css";

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <>
      <header className="header">
        <nav className="header__nav">
          <Link to="/" className="header__logo">
            <span className="header__logo-accent">on</span>Shift
          </Link>
          {user ? (
            <button
              className="header__login-btn btn btn--primary"
              onClick={logout}
            >
              Logga ut
            </button>
          ) : (
            <button
              className="header__login-btn btn btn--primary"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Logga in
            </button>
          )}
        </nav>
      </header>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        showCloseButton={true}
      >
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      </Modal>
    </>
  );
}

export default Header;
