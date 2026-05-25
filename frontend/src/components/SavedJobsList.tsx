import { Link } from "react-router-dom";
import { getRoleLabel, formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { SavedJob } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { Clock, MapPin, Wallet, Bookmark } from "lucide-react";
import "../styles/SavedPage.css";

interface SavedJobsListProps {
  savedJobs: SavedJob[];
  isLoading: boolean;
  error: string | null;
  onUnsave: (id: number) => void;
}

function SavedJobsList({
  savedJobs,
  isLoading,
  error,
  onUnsave,
}: SavedJobsListProps) {
  if (isLoading) {
    return (
      <section className="saved-page__inner">
        <ul className="preview__list">
          {[1, 2, 3].map((i) => (
            <li key={i} className="saved-page__item">
              <div className="saved-page__skeleton skeleton" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  if (savedJobs.length === 0) {
    return (
      <section className="saved-page__inner">
        <div className="empty">
          <div className="empty__icon">
            <Bookmark size={18} aria-hidden="true" />
          </div>
          <div className="empty__content">
            <p className="empty__title">Du har inte sparat några pass än</p>
            <p className="empty__text">
              Bläddra bland lediga pass och spara de som intresserar dig.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="saved-page__inner">
      <ul className="saved-page__list">
        {savedJobs.map((job) => (
          <li key={job.job_id} className="saved-page__item">
            <Link
              to={`/jobb/${job.job_id}`}
              aria-label={`Visa sparat pass: ${getRoleLabel(job.role)} på ${job.restaurant_name}`}
            >
              <article className="saved-card">
                <header className="saved-card__header">
                  <div className="saved-card__title-row">
                    <h2 className="saved-card__title">
                      {getRoleLabel(job.role)}
                    </h2>
                    <button
                      aria-label="Ta bort från sparade"
                      className="saved-card__btn"
                      onClick={(e) => {
                        e.preventDefault();
                        onUnsave(job.job_id);
                      }}
                    >
                      <Bookmark size={20} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="saved-card__restaurant">
                    {job.restaurant_name}
                  </p>
                </header>

                <div className="saved-card__meta">
                  <div className="saved-card__meta-item">
                    <Clock size={14} aria-hidden="true" />
                    <p className="saved-card__meta-text">
                      {formatDate(job.job_date)} kl.{" "}
                      {formatTime(job.start_time)} - {formatTime(job.end_time)}
                    </p>
                  </div>

                  <div className="saved-card__meta-item">
                    <MapPin size={14} aria-hidden="true" />
                    <p className="saved-card__meta-text">
                      {job.location ?? "Ingen plats angiven"}
                    </p>
                  </div>

                  <div className="saved-card__meta-item">
                    <Wallet size={14} aria-hidden="true" />
                    <p className="saved-card__meta-text">
                      {formatCompensation(job.compensation)}
                    </p>
                  </div>

                  <ul className="saved-card__tags">
                    {job.is_urgent && (
                      <li className="badge badge--accent">Akut</li>
                    )}
                    {job.requires_experience && (
                      <li className="badge badge--accent">Erfarenhet</li>
                    )}
                  </ul>
                </div>

                <div className="divider"></div>

                <div className="saved-card__footer">
                  <p className="saved-card__published">
                    Publicerat den {formatDate(job.created_at)}
                  </p>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SavedJobsList;
