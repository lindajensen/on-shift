import { useEffect, useState } from "react";
import { getAllApplications } from "../api/applications";
import { getRoleLabel, getStatusLabel } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { WorkerApplicationPreview } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { ClipboardX } from "lucide-react";

import "../styles/WorkerApplicationsPage.css";
import "../styles/Preview.css";

function WorkerApplicationsPage() {
  const [applications, setApplications] = useState<WorkerApplicationPreview[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await getAllApplications();
        setApplications(data);
      } catch (error) {
        console.error("Kunde inte hämta ansökningar", error);
        setError("Vi kunde inte hämta dina ansökningar. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  //TODO: isLoading, error and empty state
  //? Man måste ju också kunna un-apply

  if (isLoading) {
    return (
      <section className="preview">
        <div className="section__inner">
          <header className="applications-page__header">
            <h1 className="applications-page__title">Mina ansökningar</h1>
          </header>
          <div className="preview-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="preview-skeleton skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  if (applications.length === 0) {
    return (
      <section className="preview">
        <div className="section__inner">
          <header className="applications-page__header">
            <h1 className="applications-page__title">Mina ansökningar</h1>
          </header>
          <div className="empty">
            <div className="empty__icon">
              <ClipboardX size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="empty__text">Du har inga ansökningar än.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="applications-page">
      <div className="section__inner">
        <header className="applications-page__header">
          <h1 className="applications-page__title">Mina ansökningar</h1>
        </header>

        <ul className="preview__list">
          {applications.map((application) => (
            <li key={application.id} className="preview__item">
              <article className="preview__card">
                <div className="preview__info">
                  <h3 className="preview__name">
                    {application.restaurant_name}
                  </h3>
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
      </div>
    </section>
  );
}

export default WorkerApplicationsPage;
