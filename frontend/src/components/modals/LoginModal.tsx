import LoginForm from "../LoginForm";

import "../../styles/modals/LoginModal.css";

interface LoginModalProps {
  onClose?: () => void;
}

function LoginModal({ onClose }: LoginModalProps) {
  return (
    <article>
      <LoginForm onClose={onClose} />
    </article>
  );
}

export default LoginModal;
