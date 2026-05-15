import { useEffect, useState } from "react";
import { getWorkerReviews } from "../api/worker";
import ReviewCard from "../components/ReviewCard";
import ErrorMessage from "../components/ErrorMessage";
import { Review } from "../types";
import { StarOff } from "lucide-react";

import "../styles/WorkerReviewsPage.css";

function WorkerReviewsPage() {
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
      <section className="reviews-page">
        <div className="section__inner">
          <header className="reviews-page__header">
            <h1 className="reviews-page__title">Betyg</h1>
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
      <section className="reviews-page">
        <div className="section__inner">
          <header className="reviews-page__header">
            <h1 className="reviews-page__title">Betyg</h1>
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
    <section className="reviews-page">
      <div className="section__inner">
        <header className="reviews-page__header">
          <h1 className="reviews-page__title">Betyg</h1>
        </header>

        <ul className="latest-review__list">
          {reviews.map((review) => (
            <li key={review.id} className="latest-review__item">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WorkerReviewsPage;
