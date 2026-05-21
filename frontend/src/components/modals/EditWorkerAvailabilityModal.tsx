import { useState } from "react";
import { getDayLabel } from "../../utils/formatters";
import {
  Availability,
  WorkerAvailabilityFormData,
  DayAvailability,
} from "../../types";

import "../../styles/modals/ModalForm.css";

interface EditWorkerAvailabilityModalProps {
  profile: Availability[] | undefined;
  onClose: () => void;
  onSave: (availabilityData: WorkerAvailabilityFormData) => Promise<void>;
}

function EditWorkerAvailabilityModal({
  profile,
  onClose,
  onSave,
}: EditWorkerAvailabilityModalProps) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [availability, setAvailability] = useState<DayAvailability[]>(
    days.map((day) => {
      const existingDay = profile?.find((entry) => entry.day_of_week === day);

      return {
        day_of_week: day,
        start_time: existingDay?.start_time ?? "16:00",
        end_time: existingDay?.end_time ?? "23:00",
        enabled: !!existingDay,
      };
    }),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");

  // Toggles the enabled state of a specific day based on its index.
  function handleToggle(index: number) {
    const updated = [...availability];

    updated[index] = { ...updated[index], enabled: !updated[index].enabled };

    setAvailability(updated);
  }

  /**
   * Handles changes to the time inputs for a specific day and field (start_time or end_time).
   * @param index - The index of the day being updated.
   * @param field - The specific field of the day to update ("start_time" or "end_time").
   * @param value - The new time value for the specified field.
   */
  function handleTimeChange(
    index: number,
    field: keyof DayAvailability,
    value: string | null,
  ) {
    const updated = [...availability];

    updated[index] = { ...updated[index], [field]: value };

    setAvailability(updated);
  }

  // Handles the submission of the availability data, filtering out disabled days.
  async function handleSubmit() {
    setIsSubmitting(true);

    try {
      const filteredAvailability = availability
        .filter((entry) => entry.enabled)
        .map(({ day_of_week, start_time, end_time }) => ({
          day_of_week,
          start_time,
          end_time,
        }));

      await onSave({ availability: filteredAvailability });
    } catch (error) {
      console.error("Kunde inte spara erfarenhet", error);
      setServerError("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="modal-form">
      <header className="modal-form__header" id="modal-title">
        <h2 className="modal-form__title">Tillgänglighet</h2>
      </header>

      <form className="modal-form__form">
        <ul className="modal-form__days-list">
          {availability.map((day, index) => (
            <li
              key={day.day_of_week}
              className={`modal-form__day-row ${!day.enabled ? "modal-form__day-row--disabled" : ""}`}
            >
              <span className="modal-form__day-label">
                {getDayLabel(day.day_of_week)}
              </span>
              <input
                type="time"
                className="modal-form__time-input"
                value={day.start_time}
                onChange={(e) =>
                  handleTimeChange(index, "start_time", e.target.value)
                }
              />
              <span className="modal-form__day-separator">-</span>
              <input
                type="time"
                className="modal-form__time-input"
                value={day.end_time}
                onChange={(e) =>
                  handleTimeChange(index, "end_time", e.target.value)
                }
              />
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={() => handleToggle(index)}
              />
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

export default EditWorkerAvailabilityModal;
