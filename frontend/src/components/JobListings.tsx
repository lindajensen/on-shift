import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../api/jobs";
import { getRoleLabel, formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { PublicJobListing } from "../types";
import { Search, MapPin, Clock, ChevronRight } from "lucide-react";

import "../styles/JobListings.css";

function JobListings() {
  const [jobs, setJobs] = useState<PublicJobListing[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        setJobs(data);
        console.log(data);
      } catch (error) {
        console.error("Kunde inte hämta pass", error);
      }
    }

    fetchJobs();
  }, []);

  return (
    //TODO: Error and loading state (see JobsPage)

    <section className="job-listings">
      <div className="section__inner">
        <header className="job-listings__header">
          <div className="job-listings__header-right">
            <h2 className="job-listings__title">Lediga pass just nu</h2>
            <p className="job-listings__subtitle">
              Säkra ett pass innan det försvinner
            </p>
          </div>
          <Link className="job-listings__see-all" to="/jobb">
            Se alla pass
            <ChevronRight size={16} />
          </Link>
        </header>

        {jobs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <Search size={18} />
            </div>
            <div>
              <p className="empty-title">Inga pass hittades</p>
            </div>
          </div>
        ) : (
          <ul className="job-list">
            {jobs.slice(0, 4).map((job) => (
              <li className="job-list__item">
                <Link to={`/jobb/${job.id}`}>
                  <article className="job-card">
                    <div className="job-card__header">
                      <h3 className="job-card__role">
                        {getRoleLabel(job.role)}
                      </h3>
                      <span className="job-card__pay">
                        {formatCompensation(job.compensation)}
                      </span>
                    </div>
                    <p className="job-card__restaurant">
                      {job.restaurant_name}
                    </p>

                    <div className="job-card__meta">
                      <div className="job-card__meta-item">
                        <Clock size={14} />
                        <p className="job-card__meta-text">
                          {formatDate(job.job_date)} kl.{" "}
                          {formatTime(job.start_time)} -{" "}
                          {formatTime(job.end_time)}
                        </p>
                      </div>
                      <div className="job-card__meta-item">
                        <MapPin size={14} />
                        <p className="job-card__meta-text">
                          {job.location ?? "Plats ej angiven"}
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
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default JobListings;
