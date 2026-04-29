import { useState } from "react";
import { EmployerJobListing, JobModalErrors, JobFormData } from "../../types";
import { Asterisk } from "lucide-react";

import "../../styles/modals/JobModal.css";

interface JobModalProps {
  job: EmployerJobListing | null;
  onClose: () => void;
  onSave: (jobData: JobFormData) => Promise<void>;
}

function JobModal({ job, onClose, onSave }: JobModalProps) {
  const [role, setRole] = useState(job?.role || "");
  const [date, setDate] = useState(job?.job_date?.split("T")[0] || "");
  const [startTime, setStartTime] = useState(job?.start_time || "");
  const [endTime, setEndTime] = useState(job?.end_time || "");
  const [compensation, setCompensation] = useState(
    job?.compensation
      ? Number(job.compensation).toString().replace(/\.00$/, "")
      : "",
  );
  const [availableSlots, setAvailableSlots] = useState(
    job?.available_slots?.toString() || "",
  );
  const [description, setDescription] = useState(job?.description || "");
  const [isUrgent, setIsUrgent] = useState(job?.is_urgent || false);
  const [requiresExperience, setRequiresExperience] = useState(
    job?.requires_experience || false,
  );
  const [errors, setErrors] = useState<JobModalErrors>({});
  const [serverError, setServerError] = useState("");

  //TODO: Funkar toggle?
  //TODO: Claude Design Code header???
  //TODO: Move serverError rendering

  function handleUrgentToggle() {
    const updatedUrgency = !isUrgent;
    setIsUrgent(updatedUrgency);
  }

  function handleExperienceToggle() {
    setRequiresExperience((previous) => !previous);
  }

  function validateJobForm() {
    const newErrors: { [key: string]: string } = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (!role) newErrors.role = "Ange roll";

    if (!date) newErrors.date = "Ange datum";

    if (selectedDate < today)
      newErrors.date = "Datum kan inte vara i det förflutna";

    if (!startTime) newErrors.startTime = "Ange en starttid";

    if (!endTime) newErrors.endTime = "Ange en sluttid";

    if (startTime && endTime && startTime >= endTime)
      newErrors.endTime = "Sluttiden måste vara efter starttiden";

    if (!compensation.trim()) newErrors.compensation = "Ange ersättning";

    if (!availableSlots || Number(availableSlots) < 1)
      newErrors.availableSlots = "Ange minst en plats";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleAddJobbListing() {
    if (!validateJobForm()) return;

    const newJobListing = {
      role,
      date,
      startTime,
      endTime,
      compensation,
      availableSlots,
      description,
      isUrgent,
      requires_experience: requiresExperience,
    };

    try {
      await onSave(newJobListing);

      console.log("Saved new job listing", newJobListing);
    } catch (error) {
      console.error("Kunde inte spara annonsen", error);
      setServerError("Något gick fel. Försök igen senare.");
    }
  }

  return (
    <article className="job-modal">
      <header className="job-modal__header">
        <h2 className="job-modal__title">
          {job ? "Redigera pass" : "Lägg till pass"}
        </h2>
        <p className="job-modal__subtitle">
          {job
            ? "Redigera informationen om passet"
            : "Fyll i information om passet"}
        </p>
      </header>

      <form className="job-modal__form">
        <div className="job-modal__field">
          <label className="job-modal__label" htmlFor="role">
            Roll
            <span>
              <Asterisk size={14} />
            </span>
          </label>
          <select
            className="job-modal__select"
            name="role"
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setErrors((prev) => ({ ...prev, role: "" }));
            }}
          >
            <option value="" disabled>
              Välj roll
            </option>
            <option value="waiter">Servitör</option>
            <option value="chef">Kock</option>
            <option value="bartender">Bartender</option>
            <option value="dishwasher">Diskare</option>
            <option value="runner">Runner</option>
          </select>
          {errors.role && <span className="form-error">{errors.role}</span>}
        </div>

        <div className="job-modal__field">
          <label className="job-modal__label" htmlFor="date">
            Datum
            <span>
              <Asterisk size={14} />
            </span>
          </label>
          <input
            className="job-modal__input"
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((prev) => ({ ...prev, date: "" }));
            }}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="job-modal__row">
          <div className="job-modal__field">
            <label className="job-modal__label" htmlFor="start-time">
              Starttid
              <span>
                <Asterisk size={14} />
              </span>
            </label>
            <input
              className="job-modal__input"
              type="time"
              name="start-time"
              id="start-time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setErrors((prev) => ({ ...prev, startTime: "" }));
              }}
            />
            {errors.startTime && (
              <span className="form-error">{errors.startTime}</span>
            )}
          </div>
          <div className="job-modal__field">
            <label className="job-modal__label" htmlFor="end-time">
              Sluttid
              <span>
                <Asterisk size={14} />
              </span>
            </label>
            <input
              className="job-modal__input"
              type="time"
              name="end-time"
              id="end-time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setErrors((prev) => ({ ...prev, endTime: "" }));
              }}
            />
            {errors.endTime && (
              <span className="form-error">{errors.endTime}</span>
            )}
          </div>
        </div>

        <div className="job-modal__row">
          <div className="job-modal__field">
            <label className="job-modal__label" htmlFor="compensation">
              Ersättning (kr/h)
              <span>
                <Asterisk size={14} />
              </span>
            </label>
            <input
              className="job-modal__input"
              type="text"
              id="compensation"
              value={compensation}
              onChange={(e) => {
                setCompensation(e.target.value);
                setErrors((prev) => ({ ...prev, compensation: "" }));
              }}
            />
            {errors.compensation && (
              <span className="form-error">{errors.compensation}</span>
            )}
          </div>

          <div className="job-modal__field">
            <label className="job-modal__label" htmlFor="slots">
              Antal platser
              <span>
                <Asterisk size={14} />
              </span>
            </label>
            <input
              className="job-modal__input"
              type="number"
              name="slots"
              id="slots"
              value={availableSlots}
              onChange={(e) => {
                setAvailableSlots(e.target.value);
                setErrors((prev) => ({ ...prev, availableSlots: "" }));
              }}
            />
            {errors.availableSlots && (
              <span className="form-error">{errors.availableSlots}</span>
            )}
          </div>
        </div>

        <div className="job-modal__field">
          <label className="job-modal__label" htmlFor="description">
            Beskrivning (valfritt)
          </label>
          <textarea
            className="job-modal__textarea"
            name="description"
            id="description"
            rows={6}
            placeholder="Berätta mer om passet, krav eller annat relevant..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
        </div>

        <div className="divider"></div>

        {/* Toggle */}
        <div className="job-modal__toggle-row">
          <div className="job-modal__toggle-info">
            <p className="job-modal__toggle-title">Akut</p>
            <p className="job-modal__toggle-subtitle">
              Markera passet som akut
            </p>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              className="toggle__input"
              checked={isUrgent}
              onChange={handleUrgentToggle}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="divider"></div>

        <div className="job-modal__toggle-row">
          <div className="job-modal__toggle-info">
            <p className="job-modal__toggle-title">Erfarenhet krävs</p>
            <p className="job-modal__toggle-subtitle">
              Markera om erfarenhet är ett krav
            </p>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              className="toggle__input"
              checked={requiresExperience}
              onChange={handleExperienceToggle}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="divider"></div>

        {serverError && <span className="server-error">{serverError}</span>}

        <div className="job-modal__footer">
          <button
            type="button"
            className="btn btn--outline job-modal__submit"
            onClick={onClose}
          >
            Avbryt
          </button>

          <button
            type="button"
            className="btn btn--primary job-modal__submit"
            onClick={() => handleAddJobbListing()}
          >
            {job ? "Spara ändringar" : "Lägg till pass"}
          </button>
        </div>
      </form>
    </article>
  );
}

export default JobModal;
