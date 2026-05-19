import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJobApplications,
  hireApplicant,
  rejectApplicant,
  createEmployerReview,
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

  //TODO: CV button <a href={cv_url} target="_blank">
  //TODO: Message button

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
                  </div>

                  {/* Dropdown Menu */}
                  {openMenuId === application.id && (
                    <div className="application-card__menu">
                      <ul className="application-card__menu-list">
                        <li className="application-card__menu-item">
                          <ExternalLink size={16} aria-hidden="true" />
                          <Link
                            to={`/mina-annonser/${application.job_id}`}
                            className="application-card__menu-btn"
                          >
                            Gå till annons
                          </Link>
                        </li>
                        <li className="application-card__menu-item">
                          <User2 size={16} aria-hidden="true" />
                          <Link
                            to={`/personal/${application.worker_id}`}
                            className="application-card__menu-btn"
                          >
                            Gå till profil
                          </Link>
                        </li>

                        <li className="application-card__menu-item">
                          <FileText size={16} aria-hidden="true" />
                          <button className="application-card__menu-btn">
                            Visa CV
                          </button>
                        </li>
                        <li className="application-card__menu-item">
                          <MessageCircle size={16} aria-hidden="true" />
                          <button className="application-card__menu-btn">
                            Skicka meddelande
                          </button>
                        </li>

                        {application.status === "hired" &&
                          hasJobDatePassed(application.job_date) && (
                            <li className="application-card__menu-item">
                              <Star size={16} aria-hidden="true" />
                              <button
                                className="application-card__menu-btn"
                                disabled={application.has_review}
                                onClick={() => {
                                  setApplicationToReview(application);
                                  setIsReviewModalOpen(true);
                                }}
                              >
                                {application.has_review
                                  ? "Betygsatt"
                                  : "Betygsätt"}
                              </button>
                            </li>
                          )}

                        <li className="application-card__menu-item">
                          <ChefHat size={16} aria-hidden="true" />
                          <button
                            className="application-card__menu-btn"
                            disabled={application.status !== "pending"}
                            onClick={() => handleHire(application.id)}
                          >
                            Anställ
                          </button>
                        </li>
                        <li className="application-card__menu-item application-card__menu-item--danger">
                          <Ban size={16} aria-hidden="true" />
                          <button
                            className="application-card__menu-btn application-card__menu-btn--danger"
                            disabled={application.status !== "pending"}
                            onClick={() => handleReject(application.id)}
                          >
                            Tacka nej
                          </button>
                        </li>
                      </ul>
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
    </>
  );
}

export default EmployerApplicationsPage;
