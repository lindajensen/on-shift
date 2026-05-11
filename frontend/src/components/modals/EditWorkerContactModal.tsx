import { useState } from "react";
import { validateEmail, validatePhone } from "../../utils/validation";
import {
  WorkerProfile,
  EditWorkerContactFormData,
  EditWorkerContactValidationErrors,
} from "../../types";
import { Asterisk } from "lucide-react";

import "../../styles/modals/ModalForm.css";

interface EditWorkerContactModalProps {
  profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (contactData: EditWorkerContactFormData) => Promise<void>;
}

function EditWorkerContactModal({
  profile,
  onClose,
  onSave,
}: EditWorkerContactModalProps) {
  const [name, setName] = useState(profile?.name);
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [city, setCity] = useState(profile?.city || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<EditWorkerContactValidationErrors>({});
  const [serverError, setServerError] = useState("");

  function validateInput(): boolean {
    const newErrors: EditWorkerContactValidationErrors = {};

    if (!name || name.trim() === "") {
      newErrors.name = "Ange ditt namn";
    }

    if (!email || email.trim() === "") {
      newErrors.email = "Ange en e-postadress";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Ange ett giltigt telefonnummer";
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

export default EditWorkerContactModal;
