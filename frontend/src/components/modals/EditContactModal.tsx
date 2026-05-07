import { useState } from "react";
import {
  validateEmail,
  validatePhone,
  validatePostalCode,
} from "../../utils/validation";
import {
  EditContactFormData,
  EmployerProfile,
  EditContactValidationErrors,
} from "../../types";
import { Asterisk } from "lucide-react";

import "../../styles/modals/ModalForm.css";

interface EditContactModalProps {
  profile: EmployerProfile | null;
  onClose: () => void;
  onSave: (contactData: EditContactFormData) => Promise<void>;
}

function EditContactModal({ profile, onClose, onSave }: EditContactModalProps) {
  const [name, setName] = useState(profile?.name);
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [street, setStreet] = useState(profile?.street || "");
  const [postalCode, setPostalCode] = useState(profile?.postal_code || "");
  const [city, setCity] = useState(profile?.city || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<EditContactValidationErrors>({});
  const [serverError, setServerError] = useState("");

  function validateInput(): boolean {
    const newErrors: EditContactValidationErrors = {};

    if (!name || name.trim() === "") {
      newErrors.name = "Ange restaurangnamnet";
    }

    if (!email || email.trim() === "") {
      newErrors.email = "Ange en e-postadress";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Ange ett giltigt telefonnummer";
    }

    if (!validatePostalCode(postalCode)) {
      newErrors.postalCode = "Ange ett giltigt postnummer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateInput()) return;

    setIsSubmitting(true);

    const contactData = {
      name,
      email,
      phone,
      street,
      postal_code: postalCode,
      city,
    };

    try {
      await onSave(contactData);
    } catch (error) {
      console.error("Kunde inte spara kontaktinformation", error);
      setServerError("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="modal-form">
      <header className="modal-form__header">
        <h2 className="modal-form__title">Kontaktinfo</h2>
      </header>

      <form className="modal-form__form">
        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="name">
            Namn
            <span>
              <Asterisk size={14} aria-hidden="true" />
            </span>
          </label>
          <input
            className="modal-form__input"
            id="name"
            type="text"
            autoComplete="organization"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="email">
            E-post
            <Asterisk size={14} aria-hidden="true" />
          </label>
          <input
            className="modal-form__input"
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="phone">
            Telefon
          </label>
          <input
            className="modal-form__input"
            type="tel"
            name="phone"
            id="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((prev) => ({ ...prev, phone: "" }));
            }}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="street">
            Gatuadress
          </label>
          <input
            className="modal-form__input"
            id="street"
            type="text"
            autoComplete="street-address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>

        <div className="modal-form__field--row">
          <div className="modal-form__field">
            <label className="modal-form__label" htmlFor="postal-code">
              Postnummer
            </label>
            <input
              className="modal-form__input"
              id="postal-code"
              type="text"
              autoComplete="postal-code"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
                setErrors((prev) => ({ ...prev, postalCode: "" }));
              }}
            />
            {errors.postalCode && (
              <span className="form-error">{errors.postalCode}</span>
            )}
          </div>

          <div className="modal-form__field">
            <label className="modal-form__label" htmlFor="city">
              Stad
            </label>
            <input
              className="modal-form__input"
              id="city"
              type="text"
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {serverError && <span className="server-error">{serverError}</span>}

        <div className="modal-form__actions">
          <button className="btn btn--outline" type="button" onClick={onClose}>
            Avbryt
          </button>
          <button
            className="btn btn--primary"
            disabled={isSubmitting}
            type="button"
            onClick={() => handleSubmit()}
          >
            {isSubmitting ? (
              <span className="submitting-spinner"></span>
            ) : (
              "Spara"
            )}
          </button>
        </div>
      </form>
    </article>
  );
}

export default EditContactModal;
