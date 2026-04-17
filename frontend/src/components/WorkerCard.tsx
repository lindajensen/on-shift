import { Link } from "react-router-dom";
import { Worker } from "../types";
import { User2, Bookmark, Star, MapPin, Clock } from "lucide-react";
import "../styles/WorkerCard.css";

interface WorkerCardProps {
  worker: Worker;
  isAnonymous?: boolean;
}

function WorkerCard({ worker, isAnonymous = false }: WorkerCardProps) {
  // TODO: Replace hardcoded data with worker prop
  //TODO: Bookmark filled in when worker is saved as favourite

  return (
    <article className="worker-card">
      <header className="worker-card__header">
        <div className="worker-card__avatar avatar">
          {isAnonymous ? <User2 size={20} /> : <span>EL</span>}
        </div>
        <div className="worker-card__info">
          <div className="worker-card__name-row">
            {isAnonymous ? (
              <div className="worker-card__name-skeleton" />
            ) : (
              <span className="worker-card__name">Erik Lindgren</span>
            )}
            {!isAnonymous && <Bookmark size={16} />}
            <div className="worker-card__rating">
              <Star size={14} />
              <span>4.5</span>
            </div>
          </div>
          <p className="worker-card__role">Kock · 5 års erfarenhet</p>
        </div>
      </header>

      <div className="worker-card__meta">
        <div className="worker-card__meta-item">
          <Clock size={14} />
          <p className="worker-card__meta-text">Helger | dagar och kvällar</p>
        </div>
        <div className="worker-card__meta-item">
          <MapPin size={14} />
          <p className="worker-card__meta-text">Göteborg</p>
        </div>
      </div>

      <div>
        <div className="worker-card__tags">
          <span className="badge badge--neutral">Kockutbildning</span>
          <span className="badge badge--neutral">Kassasystem</span>
          <span className="badge badge--neutral">Engelska</span>
        </div>
      </div>

      {isAnonymous ? (
        <Link className="btn btn--primary btn--full" to="/login">
          Logga in för att kontakta
        </Link>
      ) : (
        <>
          <Link className="btn btn--outline" to="#">
            Visa profil
          </Link>
          <button className="btn btn--primary">Skicka meddelande</button>
        </>
      )}
    </article>
  );
}

export default WorkerCard;
