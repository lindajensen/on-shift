import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllJobListings,
  createJobListing,
  updateJobListing,
  closeJobListing,
  reopenJobListing,
} from "../api/employerJobs";
import { formatDate, formatTime } from "../utils/date";
import { getJobStatusLabel, getRoleLabel } from "../utils/formatters";
import { EmployerJobListing, JobFormData } from "../types";

import Modal from "../components/modals/Modal";
import JobModal from "../components/modals/JobModal";
import ErrorMessage from "../components/ErrorMessage";

import {
  Plus,
  Clock,
  Edit,
  CalendarX2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import "../styles/EmployerJobListingsPage.css";

function EmployerJobListingsPage() {
  const [employerJobListings, setEmployerJobListings] = useState<
    EmployerJobListing[]
  >([]);
  const [selectedJob, setSelectedJob] = useState<EmployerJobListing | null>(
    null,
  );
  const [jobToClose, setJobToClose] = useState<number | null>(null);

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"aktiva" | "avslutade">("aktiva");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployerJobListings() {
      try {
        const data = await getAllJobListings();
        setEmployerJobListings(data);
      } catch (error) {
        console.error("Kunde inte hämta pass", error);
        setError("Inga pass hittades");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployerJobListings();
  }, []);

  async function handleSave(jobData: JobFormData) {
    try {
      if (selectedJob) {
        //Update listing
        const updatedJob = await updateJobListing(jobData, selectedJob.id);

        setEmployerJobListings((prev) =>
          prev.map((job) =>
            job.id === selectedJob.id
              ? { ...updatedJob, application_count: job.application_count }
              : job,
          ),
        );
      } else {
        //Add new listing
        const newJob = await createJobListing(jobData);
        setEmployerJobListings((prev) => [
          ...prev,
          { ...newJob, application_count: "0" },
        ]);
      }

      setIsJobModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Kunde inte spara annonsen", error);
    }
  }

  async function handleClose(id: number) {
    try {
      await closeJobListing(id);
      setEmployerJobListings((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: "closed" } : job)),
      );
    } catch (error) {
      console.error("Kunde inte avsluta annonsen", error);
    }
  }

  async function handleReopen(id: number) {
    try {
      await reopenJobListing(id);
      await closeJobListing(id);
      setEmployerJobListings((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: "active" } : job)),
      );
    } catch (error) {
      console.error("Kunde inte återaktivera annonsen", error);
    }
  }

  const activeListings = employerJobListings
    .filter((job) => job.status === "active" || job.status === "filled")
    .sort(
      (a, b) => new Date(a.job_date).getTime() - new Date(b.job_date).getTime(),
    );

  const closedListings = employerJobListings
    .filter((job) => job.status === "closed")
    .sort(
      (a, b) => new Date(b.job_date).getTime() - new Date(a.job_date).getTime(),
    );

  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <section className="job-listings-page">
        <div className="section__inner">
          <header className="job-listings-page__header">
            <h1 className="job-listings-page__title">Mina annonser</h1>
            <button
              className="btn btn--primary"
              onClick={() => {
                setIsJobModalOpen(true);
                setSelectedJob(null);
              }}
            >
              <Plus size={18} />
              Ny annons
            </button>
          </header>

          <div className="job-listings-page__tabs">
            <button
              className={`job-listings-page__tab ${activeTab === "aktiva" ? "job-listings-page__tab--active" : ""}`}
              onClick={() => setActiveTab("aktiva")}
            >
              Aktiva ({activeListings.length})
            </button>
            <button
              className={`job-listings-page__tab ${activeTab === "avslutade" ? "job-listings-page__tab--active" : ""}`}
              onClick={() => setActiveTab("avslutade")}
            >
              Avslutade ({closedListings.length})
            </button>
          </div>

          {isLoading && (
            <ul className="job-listings-page__list">
              {[1, 2, 3].map((i) => (
                <li key={i} className="job-listings-page__item">
                  <div className="job-listings-page__skeleton skeleton" />
                </li>
              ))}
            </ul>
          )}

          {!isLoading && activeTab === "aktiva" && (
            <>
              {activeListings.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">
                    <CalendarX2 size={18} />
                  </div>
                  <div>
                    <p className="empty-text">
                      Du har inga aktiva pass just nu.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="job-listings-page__list">
                  {activeListings.map((job) => {
                    const isFilled = job.status === "filled";

                    return (
                      <li key={job.id} className="job-listings-page__item">
                        <Link
                          to={`/mina-annonser/${job.id}`}
                          className="job-listings-page__card-link"
                        >
                          <article className="job-listings-page__card">
                            <header className="job-listings-page__card-header">
                              <div
                                className={`job-listings-page__card-indicator job-listings-page__card-indicator--${job.status}`}
                              ></div>
                              <p className="job-listings-page__card-status">
                                {getJobStatusLabel(job.status)}
                              </p>
                            </header>

                            <div className="job-listings-page__card-body">
                              <h2 className="job-listings-page__card-role">
                                {getRoleLabel(job.role)}
                              </h2>
                              <p className="job-listings-page__card-rate">
                                {Number(job.compensation).toFixed(0)} kr/h
                              </p>
                            </div>

                            <div className="job-listings-page__card-meta">
                              <Clock size={14} />
                              <p className="job-listings-page__card-meta-text">
                                {formatDate(job.job_date)} kl.{" "}
                                {formatTime(job.start_time)} -{" "}
                                {formatTime(job.end_time)}
                              </p>
                            </div>

                            <div className="divider"></div>

                            <div className="job-listings-page__card-footer">
                              <span className="badge badge--accent">
                                {parseInt(job.application_count)}{" "}
                                {parseInt(job.application_count) === 1
                                  ? "ansökning"
                                  : "ansökningar"}
                              </span>

                              <div className="job-listings-page__card-actions">
                                <button
                                  className="job-listings-page__card-edit-btn"
                                  disabled={isFilled}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedJob(job);
                                    setIsJobModalOpen(true);
                                  }}
                                >
                                  <Edit size={20} />
                                </button>

                                {job.status === "closed" ? (
                                  <button
                                    className="job-listings-page__card-reopen-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleReopen(job.id);
                                    }}
                                  >
                                    <RotateCcw size={20} />
                                  </button>
                                ) : (
                                  <button
                                    className="job-listings-page__card-close-btn"
                                    disabled={isFilled}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setJobToClose(job.id);
                                    }}
                                  >
                                    <XCircle size={20} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </article>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {!isLoading && activeTab === "avslutade" && (
            <>
              {closedListings.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">
                    <CalendarX2 size={18} />
                  </div>
                  <div>
                    <p className="empty-text">Du har inga avslutade pass.</p>
                  </div>
                </div>
              ) : (
                <ul className="job-listings-page__list">
                  {closedListings.map((job) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const jobDate = new Date(job.job_date);
                    jobDate.setHours(0, 0, 0, 0);
                    const isPastDate = jobDate < today;

                    return (
                      <li key={job.id} className="job-listings-page__item">
                        <Link
                          to={`/mina-annonser/${job.id}`}
                          className="job-listings-page__card-link"
                        >
                          <article className="job-listings-page__card">
                            <header className="job-listings-page__card-header">
                              <div
                                className={`job-listings-page__card-indicator job-listings-page__card-indicator--${job.status}`}
                              ></div>
                              <p className="job-listings-page__card-status">
                                {getJobStatusLabel(job.status)}
                              </p>
                            </header>

                            <div className="job-listings-page__card-body">
                              <h2 className="job-listings-page__card-role">
                                {getRoleLabel(job.role)}
                              </h2>
                              <p className="job-listings-page__card-rate">
                                {Number(job.compensation).toFixed(0)} kr/h
                              </p>
                            </div>

                            <div className="job-listings-page__card-meta">
                              <Clock size={14} />
                              <p className="job-listings-page__card-meta-text">
                                {formatDate(job.job_date)} kl.{" "}
                                {formatTime(job.start_time)} -{" "}
                                {formatTime(job.end_time)}
                              </p>
                            </div>

                            <div className="divider"></div>

                            <div className="job-listings-page__card-footer">
                              <span className="badge badge--accent">
                                {parseInt(job.application_count)}{" "}
                                {parseInt(job.application_count) === 1
                                  ? "ansökning"
                                  : "ansökningar"}
                              </span>

                              <div className="job-listings-page__card-actions">
                                <button
                                  className="job-listings-page__card-reopen-btn"
                                  disabled={isPastDate}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleReopen(job.id);
                                  }}
                                >
                                  <RotateCcw size={20} />
                                </button>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </section>

      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        showCloseButton={false}
      >
        <JobModal
          job={selectedJob}
          onClose={() => setIsJobModalOpen(false)}
          onSave={handleSave}
        />
      </Modal>

      {jobToClose && (
        <div className="confirm-overlay" onClick={() => setJobToClose(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Avsluta annons?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill avsluta annonsen? Nya ansökningar
              kommer inte längre att tas emot.
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setJobToClose(null)}
              >
                Avbryt
              </button>
              <button
                className=" btn confirm-button confirm-button--delete"
                onClick={() => {
                  handleClose(jobToClose);
                  setJobToClose(null);
                }}
              >
                Avsluta annons
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployerJobListingsPage;
