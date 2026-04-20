import { Star } from "lucide-react";

import "../styles/RestaurantCard.css";

interface RestaurantCardProps {
  name: string;
  location: string;
  rating: number;
}

function RestaurantCard({ name, location, rating }: RestaurantCardProps) {
  const avatar = name
    .split(" ")
    .filter((word) => /^[a-zA-ZåäöÅÄÖ]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <article className="restaurant-card">
      <div className="restaurant-card__avatar avatar">{avatar}</div>

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
