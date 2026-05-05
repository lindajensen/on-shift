import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import RestaurantCard from "../components/RestaurantCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import { getJobById } from "../api/jobs";
import { getSavedJobs, saveJob, unsaveJob } from "../api/worker";
import { useAuth } from "../context/useAuth";
import { getRoleLabel, formatCompensation } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { PublicJobListing } from "../types";

import { Clock, MapPin, Wallet, Users2, Check, Bookmark } from "lucide-react";

import "../styles/JobDetailsPage.css";

function JobDetailsPage() {
  const [job, setJob] = useState<PublicJobListing | null>(null);
  const [isSaved, setIsSaved] = useState(false);

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

  if (isLoading) return <LoadingSpinner subtitle="Hämtar pass" />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <ErrorMessage message="Inget jobb hittades" />;

  //TODO: Implement Apply functionality
  //? Where put published date

  return (
    <section className="job-details">
      <div className="section__inner">
        <header className="job-details__header">
          <div className="job-details__header-text">
            <div className="job-details__title-row">
              <h1 className="job-details__title">{getRoleLabel(job.role)}</h1>

              {user?.role === "worker" && (
                <button
                  className={`job-details__bookmark-btn ${isSaved ? "job-details__bookmark-btn--saved" : ""}`}
                  onClick={() =>
                    isSaved ? handleUnsave(job.id) : handleSave(job.id)
                  }
                >
                  <Bookmark size={20} />
                </button>
              )}
            </div>
            <p className="job-details__name">{job.restaurant_name}</p>
            <ul className="job-card__tags">
              {job.is_urgent && <li className="badge badge--accent">Akut</li>}
              {job.requires_experience && (
                <li className="badge badge--accent">Erfarenhet</li>
              )}
            </ul>
          </div>
        </header>

        <div className="divider"></div>

        <ul className="job-details__info">
          <li className="job-details__info-item">
            <div className="job-details__icon-container">
              <Clock className="job-details__info-icon" size={18} />
            </div>
            <span>
              <span className="job-details__info-label">Datum och tid</span>
              <span className="job-details__info-value">
                {formatDate(job.job_date)} kl. {formatTime(job.start_time)} -{" "}
                {formatTime(job.end_time)}
              </span>
            </span>
          </li>
          <li className="job-details__info-item">
            <div className="job-details__icon-container">
              <MapPin className="job-details__info-icon" size={18} />
            </div>
            <span>
              <span className="job-details__info-label">Plats</span>
              <span className="job-details__info-value">
                {" "}
                {job.location ?? "Plats ej angiven"}
              </span>
            </span>
          </li>
          <li className="job-details__info-item">
            <div className="job-details__icon-container">
              <Wallet className="job-details__info-icon" size={18} />
            </div>
            <span>
              <span className="job-details__info-label">Ersättning</span>
              <span className="job-details__info-value">
                {formatCompensation(job.compensation)}
              </span>
            </span>
          </li>
          <li className="job-details__info-item">
            <div className="job-details__icon-container">
              <Users2 className="job-details__info-icon" size={18} />
            </div>
            <span>
              <span className="job-details__info-label">Antal platser</span>
              <span className="job-details__info-value">
                {job.available_slots}{" "}
                {job.available_slots === 1 ? "plats" : "platser"}
              </span>
            </span>
          </li>
        </ul>

        <div className="divider"></div>

        <div className="job-details__section">
          <h2 className="job-details__section-title">Om passet</h2>
          <p className="job-details__section-text">{job.description}</p>
        </div>
        <div className="job-details__section">
          <h2 className="job-details__section-title">Krav</h2>
          {job.demands ? (
            <ul className="job-details__requirements">
              {job.demands
                .split("\n")
                .filter((line) => line.trim())
                .map((demand, index) => (
                  <li key={index} className="job-details__requirement">
                    <Check size={18} />
                    {demand}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="job-info__empty-text">Inga krav har lagts till.</p>
          )}
        </div>
        <div className="divider"></div>
        <div className="job-details__restaurant">
          <h2 className="job-details__section-title">Restaurang</h2>
          {job && (
            <RestaurantCard
              name={job.restaurant_name}
              location={job.location ?? "Plats ej angiven"}
              rating={job.rating}
            />
          )}
        </div>

        <div className="divider"></div>

        <footer className="job-details__actions">
          {user ? (
            <button className="btn btn--primary">Ansök</button>
          ) : (
            <Link className="btn btn--primary" to="/logga-in">
              Logga in för att ansöka
            </Link>
          )}
        </footer>
      </div>
    </section>
  );
}

export default JobDetailsPage;
