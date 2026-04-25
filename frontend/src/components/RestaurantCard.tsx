import { getInitials } from "../utils/text";
import { Star } from "lucide-react";

import "../styles/RestaurantCard.css";

interface RestaurantCardProps {
  name: string;
  location: string;
  rating: number;
}

function RestaurantCard({ name, location, rating }: RestaurantCardProps) {
  const initials = name ? getInitials(name) : "";

  return (
    <article className="restaurant-card">
      <div className="restaurant-card__avatar avatar">{initials}</div>

      <div className="restaurant-card__info">
        <h3 className="restaurant-card__name">{name}</h3>
        <p className="restaurant-card__meta">
          {location} | <Star size={14} /> {rating}
        </p>
      </div>
    </article>
  );
}

export default RestaurantCard;
