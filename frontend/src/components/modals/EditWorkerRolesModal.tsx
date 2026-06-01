import { useState } from "react";
import { getRoleLabel } from "../../utils/formatters";
import { WorkerRole } from "../../types";
import { Trash2 } from "lucide-react";

import "../../styles/modals/ModalForm.css";

interface EditWorkerRolesModalProps {
  profile: WorkerRole[] | undefined;
  onClose: () => void;
  onSave: (rolesData: WorkerRole[]) => Promise<void>;
}

function EditWorkerRolesModal({
  profile,
  onClose,
  onSave,
}: EditWorkerRolesModalProps) {
  const [roles, setRoles] = useState<WorkerRole[]>(profile ?? []);

  const [serverError, setServerError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Updates the experience level for a specific role based on its index.
   * @param index - The index of the role being updated.
   * @param value - The new experience level value for the specified role. (e.g. beginner, junior, experienced, senior)
   */
  function handleChange(index: number, value: string) {
    const updated = [...roles];

    updated[index] = { ...updated[index], experience_level: value };

    setRoles(updated);
  }

  function handleAdd(selectedRole: string) {
    setRoles((prev) => [
      ...prev,
      { role: selectedRole, experience_level: "junior" },
    ]);
  }

  function handleRemove(index: number) {
    setRoles((prev) =>
      prev.filter((_role, currentIndex) => currentIndex !== index),
    );
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    try {
      await onSave(roles);
    } catch (error) {
      console.error("Kunde inte spara roller", error);
      setServerError("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="modal-form">
      <header className="modal-form__header">
        <h2 className="modal-form__title" id="modal-title">
          Roller
        </h2>
        <p className="modal-form__subtitle">
          Välj de roller du söker och din erfarenhetsnivå
        </p>
      </header>

      <form className="modal-form__form">
        <ul className="modal-form__roles-list">
          {roles.map((role, index) => (
            <li key={index} className="modal-form__roles-item">
              <div className="modal-form__role-entry">
                <span className="modal-form__role-name">
                  {getRoleLabel(role.role)}
                </span>
                <select
                  className="modal-form__role-select"
                  value={role.experience_level}
                  onChange={(e) => handleChange(index, e.target.value)}
                >
                  <option value="beginner">Nybörjare</option>
                  <option value="junior">Junior</option>
                  <option value="experienced">Erfaren</option>
                  <option value="senior">Senior</option>
                </select>
                <button
                  type="button"
                  aria-label="Ta bort Servitör"
                  className="modal-form__remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="add-role">
            Lägg till roll
          </label>
          <select
            id="add-role"
            className="modal-form__input"
            value=""
            onChange={(e) => handleAdd(e.target.value)}
          >
            <option value="" disabled>
              Välj roll...
            </option>
            {!roles.some((r) => r.role === "waiter") && (
              <option value="waiter">Servitör</option>
            )}
            {!roles.some((r) => r.role === "chef") && (
              <option value="chef">Kock</option>
            )}
            {!roles.some((r) => r.role === "bartender") && (
              <option value="bartender">Bartender</option>
            )}
            {!roles.some((r) => r.role === "dishwasher") && (
              <option value="dishwasher">Diskare</option>
            )}
            {!roles.some((r) => r.role === "runner") && (
              <option value="runner">Runner</option>
            )}
          </select>
        </div>

        {serverError && <span className="server-error">{serverError}</span>}

        <div className="modal-form__actions">
          <button className="btn btn--outline" type="button" onClick={onClose}>
            Avbryt
          </button>
          <button
            className="btn btn--primary"
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

export default EditWorkerRolesModal;
