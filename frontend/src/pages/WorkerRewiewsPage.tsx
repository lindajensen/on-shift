import { useEffect, useState } from "react";
import { getWorkerReviews } from "../api/worker";
import { formatDateWithYear } from "../utils/date";
import { getRoleLabel } from "../utils/formatters";
import ErrorMessage from "../components/ErrorMessage";
import { Review } from "../types";
import { Star, StarOff } from "lucide-react";

import "../styles/WorkerReviewsPage.css";

function WorkerRewiewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getWorkerReviews();
        setReviews(data);
      } catch (error) {
        console.error("Kunde inte hämta betyg", error);
        setError("Vi kunde inte hämta dina betyg. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <section>
        <div className="section__inner">
          <header>
            <h1>Betyg</h1>
          </header>
          <ul className="latest-review__list">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <div className="latest-review__skeleton skeleton" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  if (reviews.length === 0) {
    return (
      <section>
        <div className="section__inner">
          <header>
            <h1>Betyg</h1>
          </header>
          <div className="empty">
            <div className="empty__icon">
              <StarOff size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="empty__text">Du har inte fått några betyg än.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="section__inner">
        <header>
          <h1>Betyg</h1>
        </header>

        <ul className="latest-review__list">
          {reviews.map((review) => (
            <li key={review.id} className="latest-review__item">
              <article className="latest-review__card">
                <div className="latest-review__card-meta">
                  <h3 className="latest-review__card-employer">
                    {review.reviewer_name}
                  </h3>
                  {/* <p className="latest-review__card-date">
                    {formatDateWithYear(review.created_at)}
                  </p> */}
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
                    {getRoleLabel(review.role)} ·{" "}
                    {formatDateWithYear(review.job_date)}
                  </p>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WorkerRewiewsPage;
