import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerEmployer, registerWorker } from "../api/auth";
import { validateEmail, validatePassword } from "../utils/validation";
import { RegisterValidationErrors } from "../types";
import { User2, Utensils, Asterisk } from "lucide-react";

import "../styles/AuthForm.css";

interface RegisterFormProps {
  role: "worker" | "employer";
  onRoleChange: (role: "worker" | "employer") => void;
}

function RegisterForm({ role, onRoleChange }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  /**
   * Validates the worker registration form fields and sets error messages if validation fails.
   * @returns True if the form is valid and false if there are validation errors.
   */
  function validateWorker() {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Ange ett förnamn";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Ange ett efternamn";
    }

    if (!email.trim()) {
      newErrors.email = "Ange en e-postadress";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vänligen upprepa lösenordet";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Lösenorden matchar inte";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Validates the employer registration form fields and sets error messages if validation fails.
   * @returns True if the form is valid and false if there are validation errors.
   */
  function validateEmployer() {
    const newErrors: { [key: string]: string } = {};

    if (!restaurantName.trim()) {
      newErrors.restaurantName = "Ange restaurangnamnet";
    }

    if (!email.trim()) {
      newErrors.email = "Ange en e-postadress";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vänligen upprepa lösenordet";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Lösenorden matchar inte";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handles the form submission for both worker and employer registration.
   * @param e -The form submission event.
   * @returns void
   */
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = role === "worker" ? validateWorker() : validateEmployer();

    if (!isValid) return;

    setIsSubmitting(true);

    //? Do I want auto-login or redirect to login page?
    try {
      if (role === "worker") {
        await registerWorker({ firstName, lastName, email, password, role });

        navigate("/logga-in");
      } else {
        await registerEmployer({ restaurantName, email, password, role });

        navigate("/logga-in");
      }
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
          <h1 className="auth-form__title">Skapa konto</h1>
          <p className="auth-form__subtitle">Kom igång på under 2 minuter</p>
        </header>

        <div className="auth-form__actions">
          <button
            onClick={() => {
              onRoleChange("worker");
              setErrors({});
            }}
            className={`auth-form__role-btn ${role === "worker" ? "auth-form__role-btn--active" : ""}`}
          >
            <User2 size={24} />
            <span className="auth-form__role-btn-title">Arbetstagare</span>
            <span className="auth-form__role-btn-subtitle">Jag söker jobb</span>
          </button>

          <button
            onClick={() => {
              onRoleChange("employer");
              setErrors({});
            }}
            className={`auth-form__role-btn ${role === "employer" ? "auth-form__role-btn--active" : ""}`}
          >
            <Utensils size={24} />
            <span className="auth-form__role-btn-title">Arbetsgivare</span>
            <span className="auth-form__role-btn-subtitle">
              Jag söker personal
            </span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="auth-form__form">
          {role === "worker" ? (
            <>
              <div className="auth-form__name-row">
                <div className="auth-form__field">
                  <label
                    className="auth-form__label"
                    htmlFor="worker-firstName"
                  >
                    Förnamn
                    <span>
                      <Asterisk size={14} />
                    </span>
                  </label>
                  <input
                    className="auth-form__input"
                    id="worker-firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }}
                  />
                  {errors.firstName && (
                    <span className="form-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="auth-form__field">
                  <label className="auth-form__label" htmlFor="worker-lastName">
                    Efternamn
                    <span>
                      <Asterisk size={14} />
                    </span>
                  </label>
                  <input
                    className="auth-form__input"
                    id="worker-lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }}
                  />
                  {errors.lastName && (
                    <span className="form-error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="worker-email">
                  E-post
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  type="email"
                  name="email"
                  id="worker-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="worker-password">
                  Lösenord
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  type="password"
                  name="password"
                  id="worker-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                {errors.password && (
                  <span className="form-error">{errors.password}</span>
                )}
              </div>

              <div className="auth-form__field">
                <label
                  className="auth-form__label"
                  htmlFor="confirm-worker-password"
                >
                  Upprepa lösenord
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  type="password"
                  name="confirm-password"
                  id="confirm-worker-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                />
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="employer-name">
                  Restaurangens namn
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  id="employer-name"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => {
                    setRestaurantName(e.target.value);
                    setErrors((prev) => ({ ...prev, restaurantName: "" }));
                  }}
                />
                {errors.restaurantName && (
                  <span className="form-error">{errors.restaurantName}</span>
                )}
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="employer-email">
                  E-post
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  type="email"
                  name="email"
                  id="employer-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="employer-password">
                  Lösenord
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  type="password"
                  name="password"
                  id="employer-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                {errors.password && (
                  <span className="form-error">{errors.password}</span>
                )}
              </div>

              <div className="auth-form__field">
                <label
                  className="auth-form__label"
                  htmlFor="confirm-worker-password"
                >
                  Upprepa lösenord
                  <span>
                    <Asterisk size={14} />
                  </span>
                </label>
                <input
                  className="auth-form__input"
                  type="password"
                  name="confirm-password"
                  id="confirm-employer-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                />
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="submitting-spinner"></span>
            ) : (
              "Skapa konto"
            )}
          </button>
          {serverError && <span className="server-error">{serverError}</span>}
        </form>

        <div className="auth-form__footer">
          <div className="divider">
            <span>Eller</span>
          </div>
          <p className="auth-form__login-text">
            Har du redan ett konto?{" "}
            <Link className="auth-form__login-link" to="/logga-in">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
