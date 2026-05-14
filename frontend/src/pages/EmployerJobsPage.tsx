import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getEmployerJobListings } from "../api/employer";
import { getSavedJobs, saveJob, unsaveJob } from "../api/worker";
import { getRoleLabel, formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { useAuth } from "../context/useAuth";
import ErrorMessage from "../components/ErrorMessage";
import { EmployerPublicJob } from "../types";
import { Bookmark, Clock, Wallet } from "lucide-react";

import "../styles/EmployerJobsPage.css";

function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerPublicJob[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());

  const { id } = useParams();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployerJobListings() {
      try {
        const data = await getEmployerJobListings(Number(id));

        setJobs(data);

        if (user?.role === "worker") {
          const saved = await getSavedJobs();
          setSavedJobIds(new Set(saved.map((job) => job.job_id)));
        }
      } catch (error) {
        console.error("Kunde inte hämta pass", error);
        setError("Inga pass hittades");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployerJobListings();
  }, [id, user?.role]);

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
      <div className="section__inner">
        <div className="empty">
          <div className="empty__icon">
            <Bookmark size={18} aria-hidden="true" />
          </div>
          <div className="empty__content">
            <p className="empty__title">Inga aktiva pass just nu</p>
            <p className="empty__text">
              Den här restaurangen har inga lediga pass för tillfället.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="employer-jobs-page">
      <div className="section__inner">
        <header className="employer-jobs-page__header">
          <h1 className="employer-jobs-page__title">
            {jobs[0].restaurant_name}
          </h1>
          <p className="employer-jobs-page__subtitle">Lediga pass</p>
        </header>

        <ul className="job-list">
          {jobs.map((job) => {
            const jobIsSaved = savedJobIds.has(job.id);

            return (
              <li key={job.id} className="job-list__item">
                <Link to={`/jobb/${job.id}`}>
                  <article className="job-card">
                    <header className="job-card__header">
                      <h2 className="job-card__role">
                        {getRoleLabel(job.role)}
                      </h2>
                      {user?.role === "worker" && (
                        <button
                          aria-label={
                            jobIsSaved ? "Ta bort från sparade" : "Spara pass"
                          }
                          className={`job-card__bookmark-btn ${jobIsSaved ? "job-card__bookmark-btn--saved" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (jobIsSaved) {
                              handleUnsave(job.id);
                            } else {
                              handleSave(job.id);
                            }
                          }}
                        >
                          <Bookmark size={18} aria-hidden="true" />
                        </button>
                      )}
                    </header>

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
                        <Wallet size={14} aria-hidden="true" />
                        <p className="job-card__meta-text">
                          {" "}
                          {formatCompensation(job.compensation)}
                        </p>
                      </div>
                    </div>

                    <div className="job-card__footer-meta">
                      <ul className="job-card__tags">
                        {job.is_urgent && (
                          <li className="badge badge--accent">Akut</li>
                        )}
                        {job.requires_experience && (
                          <li className="badge badge--accent">Erfarenhet</li>
                        )}
                      </ul>

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

export default EmployerJobsPage;
