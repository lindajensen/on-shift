import { Link } from "react-router-dom";
import { getInitials } from "../utils/text";
import { Star, Bookmark } from "lucide-react";

import "../styles/RestaurantCard.css";

interface RestaurantCardProps {
  name: string;
  location: string | null;
  rating: number | null;
  employerId?: number;
  onUnsave?: () => void;
}

function RestaurantCard({
  name,
  location,
  rating,
  employerId,
  onUnsave,
}: RestaurantCardProps) {
  const initials = name ? getInitials(name) : "";

  return (
    <Link to={`/restaurang/${employerId}`}>
      <article className="restaurant-card">
        <div className="restaurant-card__avatar avatar">{initials}</div>

        <div className="restaurant-card__info">
          <header className="restaurant-card__header">
            <h3 className="restaurant-card__name">{name}</h3>
            {onUnsave && (
              <button
                aria-label="Ta bort från favoriter"
                className="restaurant-card__unsave-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onUnsave();
                }}
              >
                <Bookmark
                  size={18}
                  aria-hidden="true"
                  className="restaurant-card__bookmark--saved"
                />
              </button>
            )}
          </header>
          <p className="restaurant-card__meta">
            {location}{" "}
            {rating && (
              <span>
                | <Star size={14} aria-hidden="true" className="rating-star" />{" "}
                {Number(rating).toFixed(1)}
              </span>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default RestaurantCard;
