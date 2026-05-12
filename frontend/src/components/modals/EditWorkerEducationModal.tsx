import { useState } from "react";
import { WorkerEducation, WorkerEducationValidationErrors } from "../../types";
import { Trash2, Asterisk } from "lucide-react";

import "../../styles/modals/ModalForm.css";

interface EditWorkerEducationModalProps {
  profile: WorkerEducation[] | undefined;
  onClose: () => void;
  onSave: (educationData: WorkerEducation[]) => Promise<void>;
}

function EditWorkerEducationModal({
  profile,
  onClose,
  onSave,
}: EditWorkerEducationModalProps) {
  const [educations, setEducations] = useState<WorkerEducation[]>(
    profile ?? [],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<WorkerEducationValidationErrors[]>([]);
  const [serverError, setServerError] = useState("");

  function validateInput(): boolean {
    const newErrors: WorkerEducationValidationErrors[] = educations.map(
      (education) => {
        const entryErrors: WorkerEducationValidationErrors = {};

        if (!education.program || education.program.trim() === "") {
          entryErrors.program = "Ange program eller utbildning";
        }

        if (!education.school || education.school.trim() === "") {
          entryErrors.school = "Ange skola";
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
   * Updates the education data for a specific field and index.
   * @param index - The index of the education being updated.
   * @param field - The specific field of the education to update (e.g. program, school or graduation year).
   * @param value - The new value for the specified field.
   */
  function handleChange(
    index: number,
    field: keyof WorkerEducation,
    value: string | null,
  ) {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };

    setEducations(updated);
  }

  // Adds a new education entry to the list with default empty values.
  function handleAdd() {
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now(),
        program: "",
        school: "",
        graduation_year: null,
      },
    ]);
  }

  // Removes an education entry from the list based on its index.
  function handleRemove(index: number) {
    setEducations((prev) =>
      prev.filter((education, currentIndex) => currentIndex !== index),
    );
  }

  async function handleSubmit() {
    if (!validateInput()) return;

    setIsSubmitting(true);

    try {
      await onSave(educations);
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
        <h2 className="modal-form__title">Utbildning</h2>
      </header>

      <form className="modal-form__form">
        <div className="modal-form__add">
          <button
            className="btn btn--full modal-form__add-btn"
            type="button"
            onClick={handleAdd}
          >
            Lägg till utbildning
          </button>
        </div>

        <ul className="modal-form__list">
          {educations.map((education, index) => (
            <li key={education.id} className="modal-form__list-item">
              <div className="modal-form__entry">
                <button
                  type="button"
                  aria-label="Ta bort utbildning"
                  className="modal-form__remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>

                <div className="modal-form__field">
                  <label htmlFor="education" className="modal-form__label">
                    Program/utbildning
                    <span>
                      <Asterisk size={14} aria-hidden="true" />
                    </span>
                  </label>
                  <input
                    type="text"
                    id="education"
                    value={education.program}
                    onChange={(e) =>
                      handleChange(index, "program", e.target.value)
                    }
                  />
                  {errors[index]?.program && (
                    <span className="form-error">{errors[index].program}</span>
                  )}
                </div>

                <div className="modal-form__field">
                  <label htmlFor="school" className="modal-form__label">
                    Skola
                    <span>
                      <Asterisk size={14} aria-hidden="true" />
                    </span>
                  </label>
                  <input
                    type="text"
                    id="school"
                    value={education.school}
                    onChange={(e) =>
                      handleChange(index, "school", e.target.value)
                    }
                  />
                  {errors[index]?.school && (
                    <span className="form-error">{errors[index].school}</span>
                  )}
                </div>

                <div className="modal-form__field">
                  <label className="modal-form__label">Examensår</label>
                  {education.graduation_year !== null && (
                    <input
                      type="text"
                      value={education.graduation_year ?? ""}
                      onChange={(e) =>
                        handleChange(index, "graduation_year", e.target.value)
                      }
                    />
                  )}

                  <div className="modal-form__checkbox-row">
                    <input
                      type="checkbox"
                      id={`ongoing-${index}`}
                      checked={education.graduation_year === null}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "graduation_year",
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

export default EditWorkerEducationModal;
