import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkerReviews } from "../api/worker";
import { formatDateWithYear } from "../utils/date";
import { capitalize } from "../utils/text";
import { Review } from "../types";
import { ChevronRight, Star } from "lucide-react";

import "../styles/LatestReview.css";

function LatestWorkerReview() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

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

  //TODO: Fallback if no review
  //TODO: Review number (5.0) is hardcoded

  return (
    <section className="latest-review">
      <header className="latest-review__header">
        <h2 className="latest-review__title">Senaste betyget</h2>
        <Link className="latest-review__link" to="/betyg">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && <div className="latest-review__skeleton skeleton" />}

      {!isLoading && (
        <ul className="latest-review__list">
          {reviews.slice(0, 1).map((review) => (
            <li key={review.id} className="latest-review__item">
              <article className="latest-review__card">
                <div className="latest-review__card-meta">
                  <h3 className="latest-review__card-employer">
                    {review.reviewer_name}
                  </h3>
                  <p className="latest-review__card-date">
                    {formatDateWithYear(review.created_at)}
                  </p>
                </div>

                <div className="latest-review__card-rating">
                  <Star className="latest-review__card-rating-icon" size={18} />
                  <span className="latest-review__card-rating-score">5.0</span>
                </div>

                <p className="latest-review__card-comment">{review.comment}</p>

                <div className="divider"></div>

                <footer className="latest-review__card-footer">
                  <p className="latest-review__footer-text">
                    {capitalize(review.role)} ·{" "}
                    {formatDateWithYear(review.job_date)}
                  </p>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default LatestWorkerReview;
