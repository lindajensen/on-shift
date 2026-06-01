import { useState } from "react";
import { getRoleLabel } from "../../utils/formatters";
import { formatDate } from "../../utils/date";
import { Star } from "lucide-react";

import "../../styles/modals/ReviewModal.css";

interface ReviewableApplication {
  role: string;
  job_date: string;
}

interface ReviewModalProps {
  application: ReviewableApplication;
  revieweeName: string;
  onClose: () => void;
  onSave: (rating: number, comment: string) => Promise<void>;
}

function ReviewModal({
  application,
  revieweeName,
  onClose,
  onSave,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");

  async function handleSubmit() {
    if (rating === 0) {
      setError("Du måste välja ett betyg.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(rating, comment);
    } catch (error) {
      console.error("Kunde inte spara betyg", error);
      setServerError("Något gick fel. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="review-modal">
      <header className="review-modal__header">
        <h2 className="review-modal__title" id="modal-title">
          Betygsätt pass
        </h2>
        <p
          className="
        review-modal__subtitle"
        >
          {revieweeName} · {getRoleLabel(application.role)} ·{" "}
          {formatDate(application.job_date)}
        </p>
      </header>

      <form className="review-modal__form">
        <fieldset className="review-modal__fieldset">
          <legend className="review-modal__legend">Betyg</legend>
          <div className="review-modal__stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} stjärnor`}
                className={`review-modal__star ${(hoverRating || rating) >= star ? "review-modal__star--active" : ""}`}
                onClick={() => {
                  setRating(star);
                  setError("");
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star size={24} aria-hidden="true" />
              </button>
            ))}
          </div>
          {error && <span className="form-error">{error}</span>}
        </fieldset>

        <label className="review-modal__label" htmlFor="comment">
          Kommentar (valfritt)
        </label>
        <textarea
          className="review-modal__textarea"
          name="comment"
          id="comment"
          rows={6}
          placeholder="Berätta om din upplevelse"
          value={comment}
          maxLength={350}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {serverError && <span className="server-error">{serverError}</span>}

        <div className="review-modal__footer">
          <button className="btn btn--outline" onClick={onClose}>
            Avbryt
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="submitting-spinner"></span>
            ) : (
              "Skicka betyg"
            )}
          </button>
        </div>
      </form>
    </article>
  );
}

export default ReviewModal;
