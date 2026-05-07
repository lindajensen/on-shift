import { MapPin, Star } from "lucide-react";

import "../styles/ProfileHeader.css";

interface ProfileHeaderProps {
  name: string;
  city: string | null;
  rating: string | null;
}

function ProfileHeader({ name, city, rating }: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      <div className="profile-header__avatar avatar">N</div>

      <div className="profile-header__info">
        <div className="profile-header__name-row">
          <h1 className="profile-header__name">{name}</h1>
          <p className="profile-header__rating">
            <Star className="rating-star" size={14} />
            {Number(rating)?.toFixed(1)}
          </p>
        </div>

        <div className="profile-header__location">
          <MapPin size={18} />
          <p className="profile-header__location-text">
            {city ?? "Ingen stad angiven"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
