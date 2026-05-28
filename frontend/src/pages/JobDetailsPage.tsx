import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getJobById } from "../api/jobs";
import { getSavedJobs, saveJob, unsaveJob, applyForJob } from "../api/worker";
import { getAllApplications } from "../api/applications";

import { useAuth } from "../context/useAuth";
import { getRoleLabel } from "../utils/formatters";

import JobInfoSection from "../components/JobInfoSection";
import RestaurantCard from "../components/RestaurantCard";
import Modal from "../components/modals/Modal";
import LoginModal from "../components/modals/LoginModal";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import { PublicJobListing } from "../types";

import { Bookmark } from "lucide-react";

import "../styles/JobDetailsPage.css";

function JobDetailsPage() {
  const [job, setJob] = useState<PublicJobListing | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const jobId = Number(id);

    async function fetchJobDetails() {
      try {
        const data = await getJobById(jobId);
        setJob(data);

        if (user?.role === "worker") {
          const savedJobs = await getSavedJobs();
          setIsSaved(savedJobs.some((saved) => saved.job_id === jobId));

          const applications = await getAllApplications();
          setHasApplied(
            applications.some((application) => application.job_id === jobId),
          );
        }
      } catch (error) {
        console.error("Kunde inte hämta jobbinformation", error);
        setError("Inget pass hittades");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobDetails();
  }, [id, user?.role]);

  async function handleSave(id: number) {
    try {
      await saveJob(id);
      setIsSaved(true);
    } catch (error) {
      console.error("Kunde inte spara pass", error);
    }
  }

  async function handleUnsave(id: number) {
    try {
      await unsaveJob(id);
      setIsSaved(false);
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

  async function handleApply() {
    if (!job) return;

    try {
      await applyForJob(job.id);
      setHasApplied(true);
    } catch (error) {
      console.error("Kunde inte skicka in ansökan", error);
    }
  }

  if (isLoading) return <LoadingSpinner subtitle="Hämtar pass" />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <ErrorMessage message="Inget jobb hittades" />;

  //TODO: Where put published date

  return (
    <>
      <section className="job-details">
        <div className="section__inner">
          <header className="job-details__header">
            <div className="job-details__header-text">
              <div className="job-details__title-row">
                <h1 className="job-details__title">{getRoleLabel(job.role)}</h1>
                {user?.role === "worker" && (
                  <button
                    aria-label={isSaved ? "Ta bort från sparade" : "Spara pass"}
                    className={`job-details__bookmark-btn ${isSaved ? "job-details__bookmark-btn--saved" : ""}`}
                    onClick={() =>
                      isSaved ? handleUnsave(job.id) : handleSave(job.id)
                    }
                  >
                    <Bookmark size={24} aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="job-details__name">{job.restaurant_name}</p>
              {(job.is_urgent || job.requires_experience) && (
                <div className="job-card__tags">
                  {job.is_urgent && (
                    <span className="badge badge--accent">Akut</span>
                  )}
                  {job.requires_experience && (
                    <span className="badge badge--accent">Erfarenhet</span>
                  )}
                </div>
              )}
            </div>

            <div className="job-details__header-actions">
              {!user ? (
                <button
                  className="btn btn--primary"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Logga in för att ansöka
                </button>
              ) : user.role === "worker" ? (
                <button
                  className="btn btn--primary"
                  disabled={hasApplied}
                  onClick={handleApply}
                >
                  {hasApplied ? "Ansökt" : "Ansök"}
                </button>
              ) : null}
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

          <div className="job-details__restaurant">
            <h2 className="job-details__section-title">Restaurang</h2>
            {job && (
              <RestaurantCard
                name={job.restaurant_name}
                location={job.city ?? "Plats ej angiven"}
                rating={job.rating}
                employerId={job.employer_id}
              />
            )}
          </div>

          <footer className="job-details__actions">
            {!user ? (
              <button
                className="btn btn--primary"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Logga in för att ansöka
              </button>
            ) : user.role === "worker" ? (
              <button
                className="btn btn--primary"
                disabled={hasApplied}
                onClick={handleApply}
              >
                {hasApplied ? "Ansökt" : "Ansök"}
              </button>
            ) : null}
          </footer>
        </div>
      </section>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        showCloseButton={true}
      >
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      </Modal>
    </>
  );
}

export default JobDetailsPage;
