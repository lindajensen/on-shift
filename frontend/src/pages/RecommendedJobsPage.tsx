import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRecommendedJobs,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "../api/worker";
import { getRoleLabel } from "../utils/formatters";
import { formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import ErrorMessage from "../components/ErrorMessage";
import { JobPreview } from "../types";
import { Clock, MapPin, Wallet, Bookmark, SearchX } from "lucide-react";

import "../styles/JobListings.css";

function RecommendedJobsPage() {
  const [jobs, setJobs] = useState<JobPreview[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendedJobs() {
      try {
        const data = await getRecommendedJobs();
        setJobs(data);

        const saved = await getSavedJobs();
        setSavedJobIds(new Set(saved.map((job) => job.job_id)));
      } catch (error) {
        console.error("Kunde inte hämta rekommenderade jobb", error);
        setError("Inga rekommenderade pass hittades");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendedJobs();
  }, []);

  async function handleSave(id: number) {
    try {
      await saveJob(id);
      setSavedJobIds((prev) => new Set(prev).add(id));
    } catch (error) {
      console.error("Kunde inte spara pass", error);
    }
  }

  async function handleUnsave(id: number) {
    try {
      await unsaveJob(id);
      setSavedJobIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

  if (isLoading) {
    return (
      <section className="job-listings-page">
        <div className="section__inner">
          <header>
            <h1>Rekommenderade pass</h1>
          </header>
          <ul className="job-listings-page__list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="job-listings-page__item">
                <div className="job-listings-page__skeleton skeleton" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  if (jobs.length === 0) {
    return (
      <section className="recommended-page">
        <div className="section__inner">
          <header className="recommended-page__header">
            <h1 className="recommended-page__title">Rekommenderade pass</h1>
          </header>
          <div className="empty">
            <div className="empty__icon">
              <SearchX size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="empty__title">Inga rekommenderade pass</p>
              <p className="empty__text">
                Se till att du har lagt till dina roller i din profil.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="section__inner">
        <header>
          <h1>Rekommenderade pass</h1>
        </header>

        <ul className="job-list">
          {jobs.map((job) => {
            const jobIsSaved = savedJobIds.has(job.id);

            return (
              <li key={job.id} className="job-list__item">
                <Link to={`/jobb/${job.id}`}>
                  <article className="job-card">
                    <div className="job-card__header">
                      <div>
                        <h2 className="job-card__role">
                          {getRoleLabel(job.role)}
                        </h2>
                        <p className="job-card__restaurant">
                          {job.restaurant_name}
                        </p>
                      </div>
                      <button
                        aria-label={
                          jobIsSaved ? "Ta bort från sparade" : "Spara pass"
                        }
                        className={`job-card__bookmark-btn ${jobIsSaved ? "job-card__bookmark-btn--saved" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (jobIsSaved) {
                            handleUnsave(job.id);
                          } else {
                            handleSave(job.id);
                          }
                        }}
                      >
                        <Bookmark size={20} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="job-card__meta">
                      <div className="job-card__meta-item">
                        <Clock size={14} aria-hidden="true" />
                        <p className="job-card__meta-text">
                          {formatDate(job.job_date)} kl.{" "}
                          {formatTime(job.start_time)} -{" "}
                          {formatTime(job.end_time)}
                        </p>
                      </div>

                      <div className="job-card__meta-item">
                        <MapPin size={14} aria-hidden="true" />
                        <p className="job-card__meta-text">
                          {job.location ?? "Ingen stad angiven"}
                        </p>
                      </div>

                      <div className="job-card__meta-item">
                        <Wallet size={14} aria-hidden="true" />
                        <p className="job-card__meta-text">
                          {" "}
                          {formatCompensation(job.compensation)}
                        </p>
                      </div>
                    </div>

                    <div className="job-card__footer-meta">
                      {(job.is_urgent || job.requires_experience) && (
                        <ul className="job-card__tags">
                          {job.is_urgent && (
                            <li className="badge badge--accent">Akut</li>
                          )}
                          {job.requires_experience && (
                            <li className="badge badge--accent">Erfarenhet</li>
                          )}
                        </ul>
                      )}

                      <div className="divider"></div>
                      <p className="job-card__published">
                        Publicerad: {formatDate(job.created_at)}
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default RecommendedJobsPage;
