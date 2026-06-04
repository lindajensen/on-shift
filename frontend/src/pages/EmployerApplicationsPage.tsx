import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJobApplications,
  hireApplicant,
  rejectApplicant,
  createEmployerReview,
  getWorkerCVUrl,
} from "../api/employer";
import { getRoleLabel, getStatusLabel } from "../utils/formatters";
import { formatDate, formatTime, hasJobDatePassed } from "../utils/date";
import Modal from "../components/modals/Modal";
import ReviewModal from "../components/modals/ReviewModal";
import ErrorMessage from "../components/ErrorMessage";
import { EmployerApplicationPreview } from "../types";
import {
  MoreHorizontal,
  ExternalLink,
  User2,
  FileText,
  MessageCircle,
  ChefHat,
  Ban,
  ClipboardX,
  Star,
} from "lucide-react";

import "../styles/EmployerApplicationsPage.css";

function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<
    EmployerApplicationPreview[]
  >([]);
  const [applicationToReview, setApplicationToReview] =
    useState<EmployerApplicationPreview | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [applicationToHire, setApplicationToHire] = useState<number | null>(
    null,
  );
  const [applicationToReject, setApplicationToReject] = useState<number | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await getJobApplications();
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

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function handleHire(id: number) {
    try {
      await hireApplicant(id);

      setApplications((prev) =>
        prev.map((application) =>
          application.id === id
            ? { ...application, status: "hired" }
            : application,
        ),
      );
    } catch (error) {
      console.error("Kunde inte godkänna ansökan", error);
    }
  }

  async function handleReject(id: number) {
    try {
      await rejectApplicant(id);

      setApplications((prev) =>
        prev.map((application) =>
          application.id === id
            ? { ...application, status: "rejected" }
            : application,
        ),
      );
    } catch (error) {
      console.error("Kunde inte neka ansökan", error);
    }
  }

  async function handleReview(rating: number, comment: string) {
    if (!applicationToReview) return;

    try {
      await createEmployerReview({
        jobId: applicationToReview.job_id,
        revieweeId: applicationToReview.worker_id,
        rating,
        comment,
      });
      setIsReviewModalOpen(false);
      setApplicationToReview(null);
      setApplications((prev) =>
        prev.map((application) =>
          application.id === applicationToReview.id
            ? { ...application, has_review: true }
            : application,
        ),
      );
    } catch (error) {
      console.error("Kunde inte spara betyg", error);
    }
  }

  async function handleViewCV(workerId: number) {
    try {
      const url = await getWorkerCVUrl(workerId);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Kunde inte öppna CV", error);
    }
  }

  if (isLoading) {
    return (
      <section className="applications-page">
        <div className="section__inner">
          <header className="applications-page__header">
            <h1 className="applications-page__title">Mina ansökningar</h1>
          </header>
          <ul>
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <div className="application-skeleton skeleton" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  if (applications.length === 0) {
    return (
      <section className="applications-page">
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

          <ul>
            {applications.map((application) => (
              <li key={application.id} className="application-item">
                <article className="application-card">
                  <div className="application-card__row">
                    <div className="application-card__info">
                      <div className="application-card__name-row">
                        <h3 className="application-card__name">
                          {application.worker_name}
                        </h3>

                        <button
                          aria-label="Fler alternativ"
                          aria-expanded={openMenuId === application.id}
                          className="application-card__more"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === application.id
                                ? null
                                : application.id,
                            );
                          }}
                        >
                          <MoreHorizontal size={20} aria-hidden="true" />
                        </button>
                      </div>

                      <p className="preview__meta">
                        {getRoleLabel(application.role)} ·{" "}
                        {formatDate(application.job_date)} kl.{" "}
                        {formatTime(application.start_time)} -{" "}
                        {formatTime(application.end_time)}
                      </p>
                    </div>
                  </div>

                  <div className="application-card__footer">
                    <span className={`badge badge--${application.status}`}>
                      {getStatusLabel(application.status)}
                    </span>
                    {application.status === "hired" &&
                      hasJobDatePassed(application.job_date) &&
                      !application.has_review && (
                        <span className="badge badge--neutral">
                          Kan betygsättas
                        </span>
                      )}
                  </div>

                  {/* Dropdown Menu */}
                  {openMenuId === application.id && (
                    <div className="application-card__menu">
                      <Link
                        to={`/mina-annonser/${application.job_id}`}
                        className="application-card__menu-btn"
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                        Gå till annons
                      </Link>

                      <Link
                        to={`/personal/${application.worker_id}`}
                        className="application-card__menu-btn"
                      >
                        <User2 size={16} aria-hidden="true" />
                        Gå till profil
                      </Link>

                      <button
                        className="application-card__menu-btn"
                        onClick={() => handleViewCV(application.worker_id)}
                      >
                        <FileText size={16} aria-hidden="true" />
                        Visa CV
                      </button>

                      {/* Contact functionality is not yet implemented. Requires a messaging system with backend support. */}
                      <button className="application-card__menu-btn">
                        <MessageCircle size={16} aria-hidden="true" />
                        Skicka meddelande
                      </button>

                      {application.status === "hired" &&
                        hasJobDatePassed(application.job_date) && (
                          <button
                            className="application-card__menu-btn"
                            disabled={application.has_review}
                            onClick={() => {
                              setApplicationToReview(application);
                              setIsReviewModalOpen(true);
                            }}
                          >
                            <Star size={16} aria-hidden="true" />
                            {application.has_review ? "Betygsatt" : "Betygsätt"}
                          </button>
                        )}

                      <button
                        className="application-card__menu-btn"
                        disabled={application.status !== "pending"}
                        onClick={() => setApplicationToHire(application.id)}
                      >
                        <ChefHat size={16} aria-hidden="true" />
                        Anställ
                      </button>

                      <button
                        className="application-card__menu-btn application-card__menu-btn--danger"
                        disabled={application.status !== "pending"}
                        onClick={() => setApplicationToReject(application.id)}
                      >
                        <Ban size={16} aria-hidden="true" />
                        Tacka nej
                      </button>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {applicationToReview && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          showCloseButton={false}
        >
          <ReviewModal
            revieweeName={applicationToReview!.worker_name}
            onClose={() => setIsReviewModalOpen(false)}
            onSave={handleReview}
            application={applicationToReview}
          />
        </Modal>
      )}

      {applicationToHire && (
        <div
          className="confirm-overlay"
          onClick={() => setApplicationToHire(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Anställ?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill anställa denna person?
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setApplicationToHire(null)}
              >
                Avbryt
              </button>
              <button
                className="btn confirm-button confirm-button--confirm"
                onClick={() => {
                  handleHire(applicationToHire);
                  setApplicationToHire(null);
                }}
              >
                Anställ
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationToReject && (
        <div
          className="confirm-overlay"
          onClick={() => setApplicationToReject(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Tacka nej?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill tacka nej? Detta kan inte ångras.
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setApplicationToReject(null)}
              >
                Avbryt
              </button>
              <button
                className="btn confirm-button confirm-button--delete"
                onClick={() => {
                  handleReject(applicationToReject);
                  setApplicationToReject(null);
                }}
              >
                Tacka nej
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployerApplicationsPage;
