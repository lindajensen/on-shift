import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkerReviews } from "../api/worker";
import { formatDateWithYear } from "../utils/date";
import { getRoleLabel } from "../utils/formatters";
import { Review } from "../types";
import { ChevronRight, Star, StarOff } from "lucide-react";

import "../styles/LatestReview.css";

function LatestWorkerReview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //TODO: Error?

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getWorkerReviews();
        setReviews(data);
      } catch (error) {
        console.error("Kunde inte hämta betyg", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <section className="latest-review">
        <header className="latest-review__header">
          <h2 className="latest-review__title">Senaste betyget</h2>
          <Link className="latest-review__link" to="/betyg">
            Visa alla
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="latest-review__skeleton skeleton" />
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="latest-review">
        <header className="latest-review__header">
          <h2 className="latest-review__title">Senaste betyget</h2>
          <Link className="latest-review__link" to="/betyg">
            Visa alla
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="empty">
          <div className="empty__icon">
            <StarOff size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="empty__text">Du har inte fått några betyg än.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="latest-review">
      <header className="latest-review__header">
        <h2 className="latest-review__title">Senaste betyget</h2>
        <Link className="latest-review__link" to="/betyg">
          Visa alla
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <ul className="latest-review__list">
        {reviews.slice(0, 1).map((review) => (
          <li key={review.id} className="latest-review__item">
            <article className="latest-review__card">
              <div className="latest-review__card-meta">
                <h3 className="latest-review__card-employer">
                  {review.reviewer_name}
                </h3>
              </div>

              <div className="latest-review__card-rating">
                <Star className="rating-star" size={18} aria-hidden="true" />
                <span className="latest-review__card-rating-score">
                  {review.rating.toFixed(1)}
                </span>
              </div>

              <p className="latest-review__card-comment">{review.comment}</p>

              <div className="divider"></div>

              <footer className="latest-review__card-footer">
                <p className="latest-review__footer-text">
                  {getRoleLabel(review.role)} ·{" "}
                  {formatDateWithYear(review.job_date)}
                </p>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LatestWorkerReview;
