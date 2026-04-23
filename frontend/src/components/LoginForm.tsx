import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { validateEmail } from "../utils/validation";
import { LoginValidationErrors } from "../types";

import "../styles/AuthForm.css";

interface LoginFormProps {
  onClose?: () => void;
}

function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  function validateUser() {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "Ange en e-postadress";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    if (!password.trim()) {
      newErrors.password = "Ange ditt lösenord";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handles the login form submission. Validates the input and attempts to log in the user.
   * @param e - The form submission event.
   * @returns void
   */
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValidUser = validateUser();

    if (!isValidUser) return;

    setIsSubmitting(true);

    try {
      await loginUser({ email, password });

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setServerError("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-form">
      <div className="auth-form__container">
        <header className="auth-form__header">
          <h1 className="auth-form__title">Välkommen</h1>
          <p className="auth-form__subtitle">Logga in på ditt konto</p>
        </header>
      </div>

      <form onSubmit={handleLogin} className="auth-form__form">
        <div className="auth-form__field">
          <label className="auth-form__label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="auth-form__field">
          <label className="auth-form__label" htmlFor="password">
            Lösenord
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <button
          className="btn btn--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="submitting-spinner"></span>
          ) : (
            "Logga in"
          )}
        </button>
        {serverError && <span className="server-error">{serverError}</span>}
      </form>

      <div className="auth-form__footer">
        <div className="divider">
          <span>Eller</span>
        </div>
        <p className="auth-form__login-text">
          Inget konto?{" "}
          <Link
            className="auth-form__login-link"
            to="/registrera"
            onClick={onClose}
          >
            Registrera dig
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
