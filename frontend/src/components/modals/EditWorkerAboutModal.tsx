import { useState } from "react";
import { WorkerAboutFormData, WorkerProfile } from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerAboutModalProps {
  profile: WorkerProfile | null;
  onClose: () => void;
  onSave: (aboutData: WorkerAboutFormData) => Promise<void>;
}

function EditWorkerAboutModal({
  profile,
  onClose,
  onSave,
}: EditWorkerAboutModalProps) {
  const [bio, setBio] = useState(profile?.bio || "");

  async function handleSubmit() {
    const aboutData = {
      bio,
    };

    try {
      await onSave(aboutData);
    } catch (error) {
      console.error("Kunde inte spara beskrivning", error);
    }
  }

  return (
    <article className="modal-form">
      <header className="modal-form__header">
        <h2 className="modal-form__title" id="modal-title">
          Om restaurangen
        </h2>
      </header>

      <form className="modal-form__form">
        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="description">
            Beskrivning
          </label>
          <textarea
            className="modal-form__input modal-form__textarea"
            id="description"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
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

export default EditWorkerAboutModal;
