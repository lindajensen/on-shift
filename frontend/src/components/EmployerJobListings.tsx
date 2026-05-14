import { getRoleLabel, formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { EmployerPublicJob } from "../types";
import { Link } from "react-router-dom";
import { Clock, Wallet, ChevronRight } from "lucide-react";
import "../styles/EmployerJobListings.css";

interface EmployerJobListingsProps {
  jobs: EmployerPublicJob[];
  employerId: number;
}

function EmployerJobListings({ jobs, employerId }: EmployerJobListingsProps) {
  if (jobs.length === 0) {
    return (
      <div className="employer-jobs">
        <header className="employer-jobs__header">
          <h2 className="employer-jobs__title">Kommande pass</h2>
        </header>
        <p className="empty-text">Inga aktiva pass just nu.</p>
      </div>
    );
  }

  return (
    <div className="employer-jobs">
      <header className="employer-jobs__header">
        <h2 className="employer-jobs__title">Kommande pass</h2>
        {jobs.length > 3 && (
          <Link
            className="employer-jobs__link"
            to={`/restaurang/${employerId}/pass`}
          >
            Visa alla
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        )}
      </header>

      <ul className="employer-jobs__list">
        {jobs.slice(0, 3).map((job) => (
          <li key={job.id} className="employer-jobs__item">
            <Link to={`/jobb/${job.id}`}>
              <article className="employer-jobs__card">
                <header className="employer-jobs__card-header">
                  <h3 className="employer-jobs__card-role">
                    {getRoleLabel(job.role)}
                  </h3>
                </header>

                <div className="employer-jobs__card-meta">
                  <div className="employer-jobs__card-meta-item">
                    <Clock size={14} aria-hidden="true" />
                    <p className="employer-jobs__card-meta-text">
                      {formatDate(job.job_date)} kl.{" "}
                      {formatTime(job.start_time)} - {formatTime(job.end_time)}
                    </p>
                  </div>
                  <div className="employer-jobs__card-meta-item">
                    <Wallet size={14} aria-hidden="true" />
                    <p className="employer-jobs__card-meta-text">
                      {formatCompensation(job.compensation)}
                    </p>
                  </div>
                </div>

                <ul className="employer-jobs__card-tags">
                  {job.is_urgent && (
                    <li className="badge badge--accent">Akut</li>
                  )}
                  {job.requires_experience && (
                    <li className="badge badge--accent">Erfarenhet</li>
                  )}
                </ul>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployerJobListings;
