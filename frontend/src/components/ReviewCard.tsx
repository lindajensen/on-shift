import { getRoleLabel } from "../utils/formatters";
import { formatDateWithYear } from "../utils/date";
import { Review } from "../types";
import { Star } from "lucide-react";

import "../styles/LatestReview.css";

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="latest-review__card">
      <div className="latest-review__card-meta">
        <h3 className="latest-review__card-employer">{review.reviewer_name}</h3>
      </div>

      <div className="latest-review__card-rating">
        <Star
          className="latest-review__card-rating-icon"
          size={18}
          aria-hidden="true"
        />
        <span className="latest-review__card-rating-score">
          {review.rating.toFixed(1)}
        </span>
      </div>

      <p className="latest-review__card-comment">{review.comment}</p>

      <div className="divider"></div>

      <footer className="latest-review__card-footer">
        <p className="latest-review__footer-text">
          {getRoleLabel(review.role)} · {formatDateWithYear(review.job_date)}
        </p>
      </footer>
    </article>
  );
}

export default ReviewCard;
