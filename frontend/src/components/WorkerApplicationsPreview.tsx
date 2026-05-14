import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllApplications } from "../api/applications";
import { formatDate, formatTime } from "../utils/date";
import { getStatusLabel } from "../utils/formatters";
import { getRoleLabel } from "../utils/formatters";
import { WorkerApplicationPreview } from "../types";
import { ChevronRight, ClipboardX } from "lucide-react";

import "../styles/Preview.css";

function WorkerApplicationsPreview() {
  const [applications, setApplications] = useState<WorkerApplicationPreview[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  //TODO: Implement error state
  //TODO: Items clickable link to detailspage?

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await getAllApplications();
        setApplications(data);
      } catch (error) {
        console.error("Kunde inte hämta ansökningar", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <section className="preview">
        <header className="preview__header">
          <h2 className="preview__title">Mina ansökningar</h2>
          <Link className="preview__link" to="/ansokningar">
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

  if (applications.length === 0) {
    return (
      <section className="preview">
        <header className="preview__header">
          <h2 className="preview__title">Mina ansökningar</h2>
          <Link className="preview__link" to="/ansokningar">
            Visa alla
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="empty">
          <div className="empty__icon">
            <ClipboardX size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="empty__text">Du har inga ansökningar än.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="preview">
      <header className="preview__header">
        <h2 className="preview__title">Mina ansökningar</h2>
        <Link className="preview__link" to="/ansokningar">
          Visa alla
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </header>
      <ul className="preview__list">
        {applications.slice(0, 3).map((application) => (
          <li key={application.id} className="preview__item">
            <article className="preview__card">
              <div className="preview__info">
                <h3 className="preview__name">{application.restaurant_name}</h3>
                <p className="preview__meta">
                  {getRoleLabel(application.role)} ·{" "}
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
    </section>
  );
}

export default WorkerApplicationsPreview;
