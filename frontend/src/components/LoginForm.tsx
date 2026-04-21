import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/AuthForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-form">
      <div className="auth-form__container">
        <header className="auth-form__header">
          <h1 className="auth-form__title">Logga in</h1>
          <p className="auth-form__subtitle">Logga in på ditt konto</p>
        </header>
      </div>

      <form className="auth-form__form">
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
              // setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
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
              // setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
        </div>

        <button className="btn btn--primary" type="submit">
          Logga in
        </button>
      </form>

      <div className="auth-form__footer">
        <div className="divider">
          <span>Eller</span>
        </div>
        <p className="auth-form__login-text">
          Inget konto?{" "}
          <Link className="auth-form__login-link" to="/registrera">
            Registrera dig
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
