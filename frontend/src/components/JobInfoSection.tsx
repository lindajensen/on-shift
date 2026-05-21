import { formatDate, formatTime } from "../utils/date";
import { formatCompensation } from "../utils/formatters";
import { Clock, MapPin, Wallet, Users2, Check } from "lucide-react";

import "../styles/JobInfoSection.css";

interface JobInfoProps {
  job_date: string;
  start_time: string;
  end_time: string;
  compensation: number;
  available_slots: number;
  description: string | null;
  demands: string | null;
  location?: string;
  is_urgent: boolean;
  requires_experience: boolean;
}

function JobInfoSection({
  job_date,
  start_time,
  end_time,
  compensation,
  available_slots,
  description,
  demands,
  location,
}: JobInfoProps) {
  //TODO: Redesign empty state

  return (
    <>
      <ul className="job-info__list">
        <li className="job-info__item">
          <div className="job-info__icon-container">
            <Clock className="job-info__icon" size={18} aria-hidden="true" />
          </div>

          <div>
            <span className="job-info__label">Datum och tid</span>
            <span className="job-info__value">
              {formatDate(job_date)} kl. {formatTime(start_time)} -{" "}
              {formatTime(end_time)}
            </span>
          </div>
        </li>

        <li className="job-info__item">
          <div className="job-info__icon-container">
            <MapPin className="job-info__icon" size={18} aria-hidden="true" />
          </div>

          <div>
            <span className="job-info__label">Plats</span>
            <span className="job-info__value">
              {location ?? "Ingen plats angiven"}
            </span>
          </div>
        </li>

        <li className="job-info__item">
          <div className="job-info__icon-container">
            <Wallet className="job-info__icon" size={18} aria-hidden="true" />
          </div>

          <div>
            <span className="job-info__label">Ersättning</span>
            <span className="job-info__value">
              {formatCompensation(compensation)}
            </span>
          </div>
        </li>

        <li className="job-info__item">
          <div className="job-info__icon-container">
            <Users2 className="job-info__icon" size={18} aria-hidden="true" />
          </div>

          <div>
            <span className="job-info__label">Platser</span>
            <span className="job-info__value">
              {available_slots} {available_slots === 1 ? "plats" : "platser"}
            </span>
          </div>
        </li>
      </ul>

      <div className="divider" />

      <div className="job-info__section">
        <h2 className="job-info__section-title">Om passet</h2>
        {description ? (
          <p className="job-info__section-text">{description}</p>
        ) : (
          <p className="job-info__section-text--empty">
            Ingen beskrivning har lagts till.
          </p>
        )}
      </div>

      <div className="job-info__section">
        <h2 className="job-info__section-title">Krav</h2>
        {demands ? (
          <ul className="job-info__requirements">
            {demands
              .split("\n")
              .filter((line) => line.trim())
              .map((demand, index) => (
                <li key={index} className="job-info__requirement">
                  <Check size={18} aria-hidden="true" />
                  {demand}
                </li>
              ))}
          </ul>
        ) : (
          <p className="job-info__section-text--empty">
            Inga krav har lagts till.
          </p>
        )}
      </div>
    </>
  );
}

export default JobInfoSection;
