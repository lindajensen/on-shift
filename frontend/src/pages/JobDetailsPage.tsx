import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RestaurantCard from "../components/RestaurantCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import { getJobById } from "../api/jobs";
import { getRestaurantByName } from "../api/restaurants";
import { Job, Restaurant } from "../types";

import { Clock, MapPin, Wallet, Users2, Check, Bookmark } from "lucide-react";

import "../styles/JobDetailsPage.css";

function JobDetailsPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchJobDetails() {
      if (!id) return;

      try {
        const jobData = await getJobById(id);
        setJob(jobData);

        const restaurantData = await getRestaurantByName(
          jobData.restaurantName,
        );
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Kunde inte hämta jobbinformation", error);
        setError("Inget jobb hittades");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner subtitle="Hämtar pass" />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <ErrorMessage message="Inget jobb hittades" />;

  //TODO: Implement Save and Apply functionalit
  //? Where put published date

  return (
    <section className="job-details">
      <div className="section__inner">
        <header className="job-details__header">
          <div className="job-details__header-text">
            <div className="job-details__title-row">
              <h1 className="job-details__title">{job.role}</h1>
              <Bookmark size={30} />
            </div>
            <p className="job-details__name">{job.restaurantName}</p>
            <ul className="job-card__tags">
              {job.isUrgent && <li className="badge badge--accent">Akut</li>}
              {job.tags.map((tag) => (
                <li key={tag} className="badge badge--accent">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="job-details__header-actions">
            {/* <button className="btn btn--outline">Spara</button> */}
            <button className="btn btn--primary">Ansök</button>
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
                {job.date} kl. {job.startTime} - {job.endTime}
              </span>
            </span>
          </li>
          <li className="job-details__info-item">
            <div className="job-details__icon-container">
              <MapPin className="job-details__info-icon" size={18} />
            </div>
            <span>
              <span className="job-details__info-label">Plats</span>
              <span className="job-details__info-value">{job.location}</span>
            </span>
          </li>
          <li className="job-details__info-item">
            <div className="job-details__icon-container">
              <Wallet className="job-details__info-icon" size={18} />
            </div>
            <span>
              <span className="job-details__info-label">Ersättning</span>
              <span className="job-details__info-value">
                {job.compensation} kr/h
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
                {job.availableSlots} platser
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
          <ul className="job-details__requirements">
            {job.requirements.map((requirement) => (
              <li key={requirement} className="job-details__requirement">
                <Check size={18} />
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <div className="divider"></div>
        <div className="job-details__restaurant">
          <h2 className="job-details__section-title">Restaurang</h2>
          {restaurant && (
            <RestaurantCard
              name={restaurant.name}
              location={restaurant.location}
              rating={restaurant.rating}
            />
          )}
        </div>

        <div className="divider"></div>

        <footer className="job-details__actions">
          {/* <button className="btn btn--outline">Spara</button> */}
          <button className="btn btn--primary">Ansök</button>
        </footer>
      </div>
    </section>
  );
}

export default JobDetailsPage;
