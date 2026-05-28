import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getExperienceLevel, getRoleLabel } from "../utils/formatters";
import { getInitials } from "../utils/text";
import { formatAvailability } from "../utils/formatters";
import { formatDateWithYear } from "../utils/date";
import { Worker } from "../types";
import { User2, Bookmark, Star, MapPin, Clock } from "lucide-react";

import "../styles/WorkerCard.css";

interface WorkerCardProps {
  worker: Worker;
  isAnonymous?: boolean;
  showBookmark?: boolean;
  showContactButton?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
}

function WorkerCard({
  worker,
  isAnonymous = false,
  showBookmark = false,
  showContactButton = false,
  isSaved,
  onSave,
  onUnsave,
}: WorkerCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = worker.name ? getInitials(worker.name) : "";

  return (
    <article
      className={`worker-card ${!isAnonymous ? "worker-card--clickable" : ""}`}
      onClick={() => {
        if (!isAnonymous) navigate(`/personal/${worker.id}`);
      }}
      role="button"
    >
      <header className="worker-card__header">
        <div className="worker-card__avatar avatar">
          {isAnonymous ? (
            <User2 size={20} aria-hidden="true" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="worker-card__info">
          <div className="worker-card__name-row">
            {isAnonymous ? (
              <div className="worker-card__name-skeleton" />
            ) : (
              <h3 className="worker-card__name">{worker.name}</h3>
            )}
            {!isAnonymous && showBookmark && (
              <button
                aria-label={isSaved ? "Ta bort från sparade" : "Spara"}
                className={`worker-card__bookmark-btn ${isSaved ? "worker-card__bookmark-btn--saved" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isSaved) {
                    onUnsave?.();
                  } else {
                    onSave?.();
                  }
                }}
              >
                <Bookmark size={20} aria-hidden="true" />
              </button>
            )}

            <div className="worker-card__rating">
              {worker.rating && (
                <span>
                  <Star className="rating-star" size={14} aria-hidden="true" />{" "}
                  {Number(worker.rating).toFixed(1)}
                </span>
              )}
            </div>
          </div>

          <p className="worker-card__role">
            {getRoleLabel(worker.roles[0].role)} ·{" "}
            {getExperienceLevel(worker.roles[0].experience_level)}{" "}
            {worker.roles.length > 1 && (
              <span className="worker-card__extra-roles">
                [+{worker.roles.length - 1}]
              </span>
            )}
          </p>
        </div>
      </header>

      <div className="worker-card__meta">
        <div className="worker-card__meta-item">
          <Clock size={14} aria-hidden="true" />
          <p className="worker-card__meta-text">
            {formatAvailability(worker.availability ?? [])}
          </p>
        </div>
        <div className="worker-card__meta-item">
          <MapPin size={14} aria-hidden="true" />
          <p className="worker-card__meta-text">
            {worker.location ?? "Ingen stad angiven"}
          </p>
        </div>
      </div>

      {worker.saved_at && <div className="divider"></div>}

      {/* <div>
          <div className="worker-card__tags">
            <span className="badge badge--neutral">Kockutbildning</span>
            <span className="badge badge--neutral">Kassasystem</span>
            <span className="badge badge--neutral">Engelska</span>
          </div>
        </div> */}

      <div className="worker-card__footer">
        {isAnonymous && (
          <Link
            className="btn btn--primary btn--full"
            to="/logga-in"
            onClick={(e) => e.stopPropagation()}
          >
            Logga in för att kontakta
          </Link>
        )}

        {!isAnonymous && showContactButton && user?.role === "employer" && (
          <button
            className="btn btn--primary worker-card__contact-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Kontakta
          </button>
        )}

        {worker.saved_at && (
          <p className="worker-card__footer--saved-at">
            Sparad den {formatDateWithYear(worker.saved_at)}
          </p>
        )}
      </div>
    </article>
  );
}

export default WorkerCard;
