import LoginForm from "../LoginForm";

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
