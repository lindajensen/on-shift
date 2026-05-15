import { useEffect, useState } from "react";
import { getAllApplications, deleteApplication } from "../api/applications";
import { getRoleLabel, getStatusLabel } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { WorkerApplicationPreview } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { ClipboardX, Trash2 } from "lucide-react";

import "../styles/WorkerApplicationsPage.css";
import "../styles/Preview.css";

function WorkerApplicationsPage() {
  const [applications, setApplications] = useState<WorkerApplicationPreview[]>(
    [],
  );
  const [applicationToDelete, setApplicationToDelete] = useState<number | null>(
    null,
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

  async function handleDelete(id: number) {
    try {
      await deleteApplication(id);
      setApplications((prev) =>
        prev.filter((application) => application.id !== id),
      );
    } catch (error) {
      console.error("Kunde inte ta bort ansökan", error);
    }
  }

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
    <>
      <section className="applications-page">
        <div className="section__inner">
          <header className="applications-page__header">
            <h1 className="applications-page__title">Mina ansökningar</h1>
          </header>

          <ul className="preview__list">
            {applications.map((application) => (
              <li key={application.id} className="preview__item">
                <article className="preview__card preview__card--with-footer">
                  <div className="preview__card-top">
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
                  </div>

                  <div className="divider"></div>
                  <footer className="preview__card-footer">
                    <button
                      className="preview__delete-btn"
                      aria-label="Ta bort ansökan"
                      disabled={application.status !== "pending"}
                      onClick={() => setApplicationToDelete(application.id)}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      Ta bort
                    </button>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {applicationToDelete && (
        <div
          className="confirm-overlay"
          onClick={() => setApplicationToDelete(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Ta bort ansökan?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill ta bort ansökan? Detta kan inte ångras.
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setApplicationToDelete(null)}
              >
                Avbryt
              </button>
              <button
                className=" btn confirm-button confirm-button--delete"
                onClick={() => {
                  handleDelete(applicationToDelete);
                  setApplicationToDelete(null);
                }}
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkerApplicationsPage;
