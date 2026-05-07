import { useState } from "react";
import { EditContactFormData, EmployerProfile } from "../../types";

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

  //TODO: Validate input

  async function handleSubmit() {
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
          </label>
          <input
            className="modal-form__input"
            id="name"
            type="text"
            autoComplete="organization"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="email">
            E-post
          </label>
          <input
            className="modal-form__input"
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            onChange={(e) => setPhone(e.target.value)}
          />
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
              onChange={(e) => setPostalCode(e.target.value)}
            />
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

        <div className="modal-form__actions">
          <button className="btn btn--outline" type="button" onClick={onClose}>
            Avbryt
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => handleSubmit()}
          >
            Spara
          </button>
        </div>
      </form>
    </article>
  );
}

export default EditContactModal;
