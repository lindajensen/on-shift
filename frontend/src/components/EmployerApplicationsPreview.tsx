import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobApplications } from "../api/employerJobs";
import { getStatusLabel } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { EmployerApplicationPreview } from "../types";
import { ChevronRight } from "lucide-react";

import "../styles/Preview.css";

function EmployerApplicationsPreview() {
  const [applications, setApplications] = useState<
    EmployerApplicationPreview[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await getJobApplications();
        setApplications(data);
      } catch (error) {
        console.error("Kunde inte hämta ansökningar", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  //TODO: Implement error state
  //TODO: Make cards clickable?
  //TODO: Avatar?

  return (
    <section className="preview">
      <header className="preview__header">
        <h2 className="preview__title">Mina ansökningar</h2>
        <Link className="preview__link" to="/ansokningar">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && (
        <div className="preview-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="preview-skeleton skeleton" />
          ))}
        </div>
      )}

      {!isLoading && (
        <ul className="preview__list">
          {applications.slice(0, 3).map((application) => (
            <li key={application.id} className="preview__item">
              <article className="preview__card">
                <div className="preview__info">
                  <h3 className="preview__name">{application.worker_name}</h3>
                  <p className="preview__meta">
                    {formatDate(application.job_date)} kl.{" "}
                    {formatTime(application.start_time)} -{" "}
                    {formatTime(application.end_time)}
                  </p>
                </div>

                <div className="preview__status">
                  <span
                    className={`badge badge--${application.status === "pending" ? "pending" : application.status === "hired" ? "hired" : "rejected"}`}
                  >
                    {getStatusLabel(application.status)}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default EmployerApplicationsPreview;
