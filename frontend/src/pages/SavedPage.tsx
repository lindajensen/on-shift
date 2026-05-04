import { useEffect, useState } from "react";
import { getSavedJobs, unsaveJob } from "../api/worker";
import { getRoleLabel, formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { SavedJob } from "../types";

import ErrorMessage from "../components/ErrorMessage";

import { Clock, MapPin, Wallet, Bookmark } from "lucide-react";

import "../styles/SavedPage.css";

function SavedPage() {
  //! If add "saved employer" functionality, make sure to change route in App and dropdown naming in AuthHeader

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const data = await getSavedJobs();
        setSavedJobs(data);
      } catch (error) {
        console.error("Kunde inte hämta sparade pass", error);
        setError(
          "Vi kunde inte hämta dina sparade pass. Kontrollera din anslutning och försök igen.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  async function handleUnsave(id: number) {
    try {
      await unsaveJob(id);
      setSavedJobs((prev) => prev.filter((job) => job.job_id !== id));
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="saved-page">
      <div className="section__inner">
        <div className="saved-page__inner">
          <header className="saved-page__header">
            <h1 className="saved-page__title">Sparade pass</h1>
          </header>

          {isLoading && (
            <ul className="preview__list">
              {[1, 2, 3].map((i) => (
                <li key={i} className="saved-page__item">
                  <div className="saved-page__skeleton skeleton" />
                </li>
              ))}
            </ul>
          )}

          {!isLoading && savedJobs.length === 0 ? (
            <div className="empty">
              <div className="empty__icon">
                <Bookmark size={18} />
              </div>
              <div className="empty__content">
                <p className="empty__title">Du har inte sparat några pass än</p>
                <p className="empty__text">
                  Bläddra bland lediga pass och spara de som intresserar dig.
                </p>
              </div>
            </div>
          ) : (
            <ul className="saved-page__list">
              {savedJobs.map((job) => (
                <li key={job.job_id} className="saved-page__item">
                  <article className="saved-card">
                    <header className="saved-card__header">
                      <div className="saved-card__title-row">
                        <h2 className="saved-card__title">
                          {getRoleLabel(job.role)}
                        </h2>
                        <button
                          className="saved-card__btn"
                          onClick={() => handleUnsave(job.job_id)}
                        >
                          <Bookmark size={20} />
                        </button>
                      </div>
                      <p className="saved-card__restaurant">
                        {job.restaurant_name}
                      </p>
                    </header>

                    <div className="saved-card__meta">
                      <div className="saved-card__meta-item">
                        <Clock size={14} />
                        <p className="saved-card__meta-text">
                          {formatDate(job.job_date)} kl.{" "}
                          {formatTime(job.start_time)} -{" "}
                          {formatTime(job.end_time)}
                        </p>
                      </div>

                      <div className="saved-card__meta-item">
                        <MapPin size={14} />
                        <p className="saved-card__meta-text">
                          {job.location ?? "Ingen plats angiven"}
                        </p>
                      </div>

                      <div className="saved-card__meta-item">
                        <Wallet size={14} />
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default SavedPage;
