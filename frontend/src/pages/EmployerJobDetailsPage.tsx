import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getJobDetails,
  updateJobListing,
  closeJobListing,
  reopenJobListing,
} from "../api/employerJobs";
import { getJobStatusLabel, getRoleLabel } from "../utils/formatters";
import { EmployerJobDetails, JobFormData } from "../types";
import { MoreHorizontal, Edit, XCircle, RotateCcw } from "lucide-react";

import JobInfoSection from "../components/JobInfoSection";
import ApplicationsSection from "../components/ApplicationsSection";
import Modal from "../components/modals/Modal";
import JobModal from "../components/modals/JobModal";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import "../styles/EmployerJobDetailsPage.css";

function EmployerJobDetailsPage() {
  const [job, setJob] = useState<EmployerJobDetails | null>(null);
  const [jobToClose, setJobToClose] = useState<number | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    function handleClickOutside() {
      setIsMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!id) return;
    const jobId = Number(id);

    async function fetchJobDetails() {
      try {
        const data = await getJobDetails(jobId);
        setJob(data);
      } catch (error) {
        console.error("Kunde inte hämta jobbinformation", error);
        setError("Ingen annons hittades");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobDetails();
  }, [id]);

  async function handleSave(jobData: JobFormData) {
    try {
      const updatedJob = await updateJobListing(jobData, job!.id);
      setJob({ ...updatedJob, applications: job!.applications });
      setIsJobModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara annonsen", error);
    }
  }

  async function handleClose(id: number) {
    try {
      await closeJobListing(id);
      setJob((prev) => (prev ? { ...prev, status: "closed" } : prev));
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Kunde inte avsluta annonsen", error);
    }
  }

  async function handleReopen(id: number) {
    try {
      await reopenJobListing(id);
      setJob((prev) => (prev ? { ...prev, status: "active" } : prev));
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Kunde inte återaktivera annonsen", error);
    }
  }

  if (isLoading) return <LoadingSpinner subtitle="Hämtar annons" />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <ErrorMessage message="Ingen annons hittades" />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const jobDate = new Date(job.job_date);
  jobDate.setHours(0, 0, 0, 0);
  const isPastDate = jobDate < today;

  const isFilled = job.status === "filled";

  //TODO: Fix hover styling dropdown menu
  //? Calculate available_spots if people are hired?

  return (
    <>
      <section className="job-details-page">
        <div className="section__inner">
          <header className="job-details-page__header">
            <div className="job-details-page__status-row">
              <div
                className={`job-details-page__indicator job-details-page__indicator--${job.status}`}
              ></div>
              <p className="job-details-page__status">
                {getJobStatusLabel(job.status)}
              </p>
            </div>

            <div className="job-details-page__title-row">
              <h1 className="job-details-page__title">
                {getRoleLabel(job.role)}
              </h1>
              <button
                aria-label="Fler alternativ"
                className="job-details-page__more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(null);
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <MoreHorizontal size={24} aria-hidden="true" />
              </button>

              {/* Drop Down Menu */}
              {isMenuOpen && (
                <div className="job-details-page__menu">
                  <button
                    className="job-details-page__menu-btn"
                    onClick={() => setIsJobModalOpen(true)}
                    disabled={isFilled}
                  >
                    <Edit size={16} aria-hidden="true" />
                    Redigera
                  </button>
                  {job.status === "closed" ? (
                    <button
                      className="job-details-page__menu-btn job-details-page__menu-btn--reopen"
                      disabled={isPastDate}
                      onClick={() => handleReopen(job.id)}
                    >
                      <RotateCcw size={16} aria-hidden="true" />
                      Återaktivera annons
                    </button>
                  ) : (
                    <button
                      className="job-details-page__menu-btn job-details-page__menu-btn--danger"
                      disabled={isFilled}
                      onClick={() => setJobToClose(job.id)}
                    >
                      <XCircle size={16} aria-hidden="true" />
                      Avsluta annons
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="job-card__tags">
              {job.is_urgent && (
                <span className="badge badge--accent">Akut</span>
              )}
              {job.requires_experience && (
                <span className="badge badge--accent">Erfarenhet</span>
              )}
            </div>
          </header>

          <div className="divider"></div>

          <JobInfoSection
            job_date={job.job_date}
            start_time={job.start_time}
            end_time={job.end_time}
            compensation={job.compensation}
            available_slots={job.available_slots}
            description={job.description}
            demands={job.demands}
            is_urgent={job.is_urgent}
            requires_experience={job.requires_experience}
          />

          <ApplicationsSection
            applications={job.applications}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onOpen={() => setIsMenuOpen(false)}
          />
        </div>
      </section>

      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        showCloseButton={false}
      >
        <JobModal
          job={job}
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

export default EmployerJobDetailsPage;
