import { useState } from "react";
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import { RegisterValidationErrors } from "../types";
import { User2, Utensils } from "lucide-react";

import "../styles/RegisterForm.css";

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

  const [errors, setErrors] = useState<RegisterValidationErrors>({});

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

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = role === "worker" ? validateWorker() : validateEmployer();

    if (!isValid) return;

    console.log(firstName, lastName);
  }

  return (
    <div className="register-form">
      <div className="register-form__container">
        <header className="register-form__header">
          <h1 className="register-form__title">Skapa konto</h1>
          <p className="register-form__subtitle">
            Kom igång på under 2 minuter
          </p>
        </header>
        <div className="register-form__actions">
          <button
            onClick={() => {
              onRoleChange("worker");
              setErrors({});
            }}
            className={`register-form__role-btn ${role === "worker" ? "register-form__role-btn--active" : ""}`}
          >
            <User2 size={24} />
            <span className="register-form__role-btn-title">Arbetstagare</span>
            <span className="register-form__role-btn-subtitle">
              Jag söker jobb
            </span>
          </button>

          <button
            onClick={() => {
              onRoleChange("employer");
              setErrors({});
            }}
            className={`register-form__role-btn ${role === "employer" ? "register-form__role-btn--active" : ""}`}
          >
            <Utensils size={24} />
            <span className="register-form__role-btn-title">Arbetsgivare</span>
            <span className="register-form__role-btn-subtitle">
              Jag söker personal
            </span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="register-form__form">
          {role === "worker" ? (
            <>
              <div className="register-form__name-row">
                <div className="register-form__field">
                  <label
                    className="register-form__label"
                    htmlFor="worker-firstName"
                  >
                    Förnamn
                  </label>
                  <input
                    className="register-form__input"
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

                <div className="register-form__field">
                  <label
                    className="register-form__label"
                    htmlFor="worker-lastName"
                  >
                    Efternamn
                  </label>
                  <input
                    className="register-form__input"
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

              <div className="register-form__field">
                <label className="register-form__label" htmlFor="worker-email">
                  E-post
                </label>
                <input
                  className="register-form__input"
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

              <div className="register-form__field">
                <label
                  className="register-form__label"
                  htmlFor="worker-password"
                >
                  Lösenord
                </label>
                <input
                  className="register-form__input"
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

              <div className="register-form__field">
                <label
                  className="register-form__label"
                  htmlFor="confirm-worker-password"
                >
                  Upprepa lösenord
                </label>
                <input
                  className="register-form__input"
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
              <div className="register-form__field">
                <label className="register-form__label" htmlFor="employer-name">
                  Restaurangens namn
                </label>
                <input
                  className="register-form__input"
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

              <div className="register-form__field">
                <label
                  className="register-form__label"
                  htmlFor="employer-email"
                >
                  E-post
                </label>
                <input
                  className="register-form__input"
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

              <div className="register-form__field">
                <label
                  className="register-form__label"
                  htmlFor="employer-password"
                >
                  Lösenord
                </label>
                <input
                  className="register-form__input"
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

              <div className="register-form__field">
                <label
                  className="register-form__label"
                  htmlFor="confirm-worker-password"
                >
                  Upprepa lösenord
                </label>
                <input
                  className="register-form__input"
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

          <button type="submit" className="btn btn--primary">
            Skapa konto
          </button>
        </form>

        <div className="register-form__footer">
          <div className="divider">
            <span>Eller</span>
          </div>
          <p className="register-form__login-text">
            Har du redan ett konto?{" "}
            <Link className="register-form__login-link" to="/logga-in">
              Logga in
            </Link>
          </p>
        </div>
      </div>

      {/* <div className="register-form__panel section__inner">
        {selectedRole === "worker" ? (
          <div className="register-form__panel__content">
            <h2 className="register-form__panel-title">
              Hoppa in och börja jobba <span>direkt</span>
            </h2>
            <ul className="register-form__panel-features">
              <li className="register-form__panel-feature">
                <div className="register-form__panel-icon">
                  <Search size={18} />
                </div>
                <div className="register-form__panel-body">
                  <h3 className="register-form__panel-feature--title">
                    Hitta pass snabbt
                  </h3>
                  <p className="register-form__panel-feature--description">
                    Blädddra bland lediga pass och ansök med ett klick.
                  </p>
                </div>
              </li>

              <li className="register-form__panel-feature">
                <div className="register-form__panel-icon">
                  <CalendarClock size={18} />
                </div>
                <div className="register-form__panel-body">
                  <h3 className="register-form__panel-feature--title">
                    Du bestämmer när du jobbar
                  </h3>
                  <p className="register-form__panel-feature--description">
                    Ange din tillgänglighet och få förfrågningar när det passar
                    dig.
                  </p>
                </div>
              </li>

              <li className="register-form__panel-feature">
                <div className="register-form__panel-icon">
                  <Star size={18} />
                </div>
                <div className="register-form__panel-body">
                  <h3 className="register-form__panel-feature--title">
                    Bygg ditt rykte
                  </h3>
                  <p className="register-form__panel-feature--description">
                    Samla betyg och bygg ett nätverk inom restaurangbranschen.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <div className="register-form__panel__content">
            <h2 className="register-form__panel-title">
              Hitta rätt personal på bara några <span>minuter</span>
            </h2>
            <ul className="register-form__panel-features">
              <li className="register-form__panel-feature">
                <div className="register-form__panel-icon">
                  <Plus size={18} />
                </div>
                <div className="register-form__panel-body">
                  <h3 className="register-form__panel-feature--title">
                    Posta ett pass snabbt och enkelt
                  </h3>
                  <p className="register-form__panel-feature--description">
                    Välj roll, datum och ersättning. Klart på under en minut.
                  </p>
                </div>
              </li>

              <li className="register-form__panel-feature">
                <div className="register-form__panel-icon">
                  <Users2 size={18} />
                </div>
                <div className="register-form__panel-body">
                  <h3 className="register-form__panel-feature--title">
                    Sök bland tillgänglig personal
                  </h3>
                  <p className="register-form__panel-feature--description">
                    Filtrera på roll, erfarenhet och tillgänglighet.
                  </p>
                </div>
              </li>

              <li className="register-form__panel-feature">
                <div className="register-form__panel-icon">
                  <Bookmark size={18} />
                </div>
                <div className="register-form__panel-body">
                  <h3 className="register-form__panel-feature--title">
                    Spara dina favoriter
                  </h3>
                  <p className="register-form__panel-feature--description">
                    Bygg ett eget nätverk av pålitlig och tillgänglig personal.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default RegisterForm;
