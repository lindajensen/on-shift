import { useEffect, useState } from "react";
import { getWorkerReviewsById } from "../api/worker";
import { Review } from "../types";
import ReviewCard from "./ReviewCard";

import "../styles/ReviewsPreview.css";

interface WorkerReviewsPreviewProps {
  workerId: number;
}

function WorkerReviewsPreview({ workerId }: WorkerReviewsPreviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getWorkerReviewsById(workerId);
        setReviews(data);
      } catch (error) {
        console.error("Kunde inte hämta betyg", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [workerId]);

  if (isLoading) {
    return (
      <section className="worker-reviews">
        <header className="worker-reviews__header">
          <h2 className="worker-reviews__title">Senaste betygen</h2>
        </header>
        <div className="worker-reviews__skeleton skeleton" />
      </section>
    );
  }

  return (
    <section className="reviews-preview">
      <header className="reviews-preview__header">
        <h2 className="reviews-preview__title">Senaste betygen</h2>
      </header>

      {reviews.length === 0 ? (
        <p className="empty-text">Inga betyg än.</p>
      ) : (
        <ul className="reviews-preview__list">
          {reviews.map((review) => (
            <li className="reviews-preview__item">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WorkerReviewsPreview;
