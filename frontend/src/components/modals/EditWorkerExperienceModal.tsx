import { useState } from "react";
import {
  WorkerExperience,
  WorkerExperienceValidationErrors,
} from "../../types";

import { Trash2, Asterisk } from "lucide-react";

import "../../styles/modals/ModalForm.css";
interface EditWorkerExperienceModalProps {
  profile: WorkerExperience[] | undefined;
  onClose: () => void;
  onSave: (experienceData: WorkerExperience[]) => Promise<void>;
}

function EditWorkerExperienceModal({
  profile,
  onClose,
  onSave,
}: EditWorkerExperienceModalProps) {
  const [experiences, setExperiences] = useState<WorkerExperience[]>(
    profile ?? [],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<WorkerExperienceValidationErrors[]>([]);
  const [serverError, setServerError] = useState("");

  function validateInput(): boolean {
    const newErrors: WorkerExperienceValidationErrors[] = experiences.map(
      (experience) => {
        const entryErrors: WorkerExperienceValidationErrors = {};

        if (!experience.job_title || experience.job_title.trim() === "") {
          entryErrors.job_title = "Ange jobbtitel";
        }

        if (!experience.workplace || experience.workplace.trim() === "") {
          entryErrors.workplace = "Ange arbetsplats";
        }

        if (!experience.start_date || experience.start_date.trim() === "") {
          entryErrors.start_date = "Ange startdatum";
        }

        return entryErrors;
      },
    );

    setErrors(newErrors);
    return newErrors.every(
      (entryErrors) => Object.keys(entryErrors).length === 0,
    );
  }

  /**
   * Updates the experience data for a specific field and index.
   * @param index - The index of the experience being updated.
   * @param field - The specific field of the experience to update (e.g. job_title, workplace).
   * @param value - The new value for the specified field.
   */
  function handleChange(
    index: number,
    field: keyof WorkerExperience,
    value: string | null,
  ) {
    const updated = [...experiences];

    updated[index] = { ...updated[index], [field]: value };

    setExperiences(updated);
  }

  // Adds a new experience entry to the list with default empty values.
  function handleAdd() {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now(),
        job_title: "",
        workplace: "",
        start_date: "",
        end_date: null,
      },
    ]);
  }

  // Removes an experience entry from the list based on its index.
  function handleRemove(index: number) {
    setExperiences((prev) =>
      prev.filter((experience, currentIndex) => currentIndex !== index),
    );
  }

  async function handleSubmit() {
    if (!validateInput()) return;

    setIsSubmitting(true);

    try {
      await onSave(experiences);
    } catch (error) {
      console.error("Kunde inte spara erfarenhet", error);
      setServerError("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="modal-form">
      <header className="modal-form__header">
        <h2 className="modal-form__title" id="modal-title">
          Erfarenhet
        </h2>
      </header>

      <form className="modal-form__form">
        <div className="modal-form__add">
          <button
            className="btn btn--full modal-form__add-btn"
            type="button"
            onClick={handleAdd}
          >
            Lägg till erfarenhet
          </button>
        </div>
        <ul className="modal-form__list">
          {experiences.map((experience, index) => (
            <li key={experience.id} className="modal-form__list-item">
              <div className="modal-form__entry">
                <button
                  type="button"
                  aria-label="Ta bort erfarenhet"
                  className="modal-form__remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>

                <div className="modal-form__field">
                  <label htmlFor="job-title" className="modal-form__label">
                    Jobbtitel
                    <span>
                      <Asterisk size={14} aria-hidden="true" />
                    </span>
                  </label>
                  <input
                    type="text"
                    id="job-title"
                    value={experience.job_title}
                    onChange={(e) =>
                      handleChange(index, "job_title", e.target.value)
                    }
                  />
                  {errors[index]?.job_title && (
                    <span className="form-error">
                      {errors[index].job_title}
                    </span>
                  )}
                </div>

                <div className="modal-form__field">
                  <label htmlFor="workplace" className="modal-form__label">
                    Arbetsplats
                    <span>
                      <Asterisk size={14} aria-hidden="true" />
                    </span>
                  </label>
                  <input
                    type="text"
                    id="workplace"
                    value={experience.workplace}
                    onChange={(e) =>
                      handleChange(index, "workplace", e.target.value)
                    }
                  />
                  {errors[index]?.workplace && (
                    <span className="form-error">
                      {errors[index].workplace}
                    </span>
                  )}
                </div>

                <div className="modal-form__field">
                  <label htmlFor="start-date" className="modal-form__label">
                    Startdatum
                    <span>
                      <Asterisk size={14} aria-hidden="true" />
                    </span>
                  </label>
                  <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    value={experience.start_date}
                    onChange={(e) =>
                      handleChange(index, "start_date", e.target.value)
                    }
                  />
                  {errors[index]?.start_date && (
                    <span className="form-error">
                      {errors[index].start_date}
                    </span>
                  )}
                </div>

                <div className="modal-form__field">
                  <label className="modal-form__label">Slutdatum</label>
                  {experience.end_date !== null && (
                    <input
                      type="date"
                      value={experience.end_date ?? ""}
                      onChange={(e) =>
                        handleChange(index, "end_date", e.target.value)
                      }
                    />
                  )}

                  <div className="modal-form__checkbox-row">
                    <input
                      type="checkbox"
                      id={`ongoing-${index}`}
                      checked={experience.end_date === null}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "end_date",
                          e.target.checked ? null : "",
                        )
                      }
                    />
                    <label htmlFor={`ongoing-${index}`}>Pågående</label>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

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

export default EditWorkerExperienceModal;
