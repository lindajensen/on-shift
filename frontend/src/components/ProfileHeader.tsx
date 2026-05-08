import { getInitials } from "../utils/text";
import { MapPin, Star, Bookmark } from "lucide-react";

import "../styles/ProfileHeader.css";

interface ProfileHeaderProps {
  name: string;
  city: string | null;
  rating: string | null;
  isOwner: boolean;
}

//TODO: Implement bookmark employer functionality for workers and fix styling of bookmark button

function ProfileHeader({ name, city, rating, isOwner }: ProfileHeaderProps) {
  const initials = name ? getInitials(name) : "";

  return (
    <div className="profile-header">
      <div className="profile-header__avatar avatar">{initials}</div>

      <div className="profile-header__info">
        <div className="profile-header__name-row">
          <div className="profile-header__name-group">
            <h1 className="profile-header__name">{name}</h1>
            {!isOwner && (
              <button aria-label="Spara restaurang">
                <Bookmark size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="profile-header__rating">
            <Star className="rating-star" size={14} aria-hidden="true" />
            {Number(rating)?.toFixed(1)}
          </p>
        </div>

        <div className="profile-header__location">
          <MapPin size={18} aria-hidden="true" />
          <p className="profile-header__location-text">
            {city ?? "Ingen stad angiven"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
