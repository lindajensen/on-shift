import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Modal from "./modals/Modal";
import LoginModal from "./modals/LoginModal";

import "../styles/Header.css";

interface HeaderProps {
  hideLoginButton?: boolean;
}

function Header({ hideLoginButton = false }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user } = useAuth();

  return (
    <>
      <header className="header">
        <nav className="header__nav" aria-label="Huvudnavigering">
          <Link to="/" className="header__logo">
            <span className="header__logo-accent">on</span>Shift
          </Link>
          {user ? (
            <Link to="/hem" className="header__login-btn btn btn--primary">
              Mina sidor
            </Link>
          ) : !hideLoginButton ? (
            <button
              className="header__login-btn btn btn--primary"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Logga in
            </button>
          ) : null}
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
