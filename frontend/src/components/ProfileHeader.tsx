import { getInitials } from "../utils/text";
import { Star, Bookmark } from "lucide-react";

import "../styles/ProfileHeader.css";

interface ProfileHeaderProps {
  name: string;
  rating: string | null;
  isOwner: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
}

function ProfileHeader({
  name,
  rating,
  isOwner,
  isSaved,
  onSave,
  onUnsave,
}: ProfileHeaderProps) {
  const initials = name ? getInitials(name) : "";

  return (
    <div className="profile-header">
      <div className="profile-header__avatar avatar">{initials}</div>

      <div className="profile-header__info">
        <div className="profile-header__name-row">
          <h1 className="profile-header__name">{name}</h1>
          {!isOwner && (
            <button
              aria-label={isSaved ? "Ta bort från sparade" : "Spara"}
              className={`profile-header__bookmark-btn ${isSaved ? "profile-header__bookmark-btn--saved" : ""}`}
              onClick={isSaved ? onUnsave : onSave}
            >
              <Bookmark size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        {rating && (
          <p className="profile-header__rating">
            <Star className="rating-star" size={14} aria-hidden="true" />
            {Number(rating).toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
