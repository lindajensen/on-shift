import { useState } from "react";
import Modal from "./modals/Modal";
import LoginModal from "./modals/LoginModal";

import "../styles/LoginNudge.css";

function LoginNudge() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <div className="login-nudge">
        <p className="login-nudge__text">Logga in för att ansöka</p>
        <button
          className="btn btn--primary"
          onClick={() => setIsLoginModalOpen(true)}
        >
          Logga in
        </button>
      </div>

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

export default LoginNudge;
