import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobListings } from "../api/employer";
import { getRoleLabel } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { EmployerJobListing } from "../types";
import { ChevronRight, CalendarX2 } from "lucide-react";

import "../styles/Preview.css";

function JobListingsPreview() {
  const [jobListings, setJobListings] = useState<EmployerJobListing[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobListings() {
      try {
        const data = await getAllJobListings();
        setJobListings(data);
      } catch (error) {
        console.error("Kunde inte hämta annonser", error);
        setError("Kunde inte hämta annonser.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobListings();
  }, []);

  const activeJobListings = jobListings.filter(
    (job) => job.status === "active" || job.status === "filled",
  );

  if (isLoading) {
    return (
      <section className="preview">
        <header className="preview__header">
          <h2 className="preview__title">Mina annonser</h2>
          <Link className="preview__link" to="/mina-annonser">
            Visa alla
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="preview-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="preview-skeleton skeleton" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="preview">
        <header className="preview__header">
          <h2 className="preview__title">Mina annonser</h2>
        </header>
        <p className="empty-text">{error}</p>
      </section>
    );
  }

  if (activeJobListings.length === 0) {
    return (
      <section className="preview">
        <header className="preview__header">
          <h2 className="preview__title">Mina annonser</h2>
          <Link className="preview__link" to="/mina-annonser">
            Visa alla
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="empty">
          <div className="empty__icon">
            <CalendarX2 size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="empty__text">Du har inga annonser just nu.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="preview">
      <header className="preview__header">
        <h2 className="preview__title">Mina annonser</h2>
        <Link className="preview__link" to="/mina-annonser">
          Visa alla
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <ul className="preview__list">
        {activeJobListings.slice(0, 3).map((jobListing) => (
          <li key={jobListing.id} className="preview__item">
            <Link
              to={`/mina-annonser/${jobListing.id}`}
              aria-label={`Visa annons: ${getRoleLabel(jobListing.role)} ${formatDate(jobListing.job_date)}`}
            >
              <article className="preview__card">
                <div className="preview__info">
                  <h3 className="preview__name">
                    {getRoleLabel(jobListing.role)}
                  </h3>
                  <p className="preview__meta">
                    {formatDate(jobListing.job_date)} kl.{" "}
                    {formatTime(jobListing.start_time)} -{" "}
                    {formatTime(jobListing.end_time)}
                  </p>
                </div>
                <div className="preview__status">
                  <p className="preview__status-count">
                    {jobListing.application_count}
                  </p>
                  <p className="preview__status-label">
                    {parseInt(jobListing.application_count) === 1
                      ? "ansökning"
                      : "ansökningar"}
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

export default JobListingsPreview;
