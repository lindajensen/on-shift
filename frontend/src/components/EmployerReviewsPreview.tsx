import { useEffect, useState } from "react";
import { getEmployerReviewsById } from "../api/employer";
import { Review } from "../types";
import ReviewCard from "./ReviewCard";

import "../styles/ReviewsPreview.css";

interface EmployerReviewsPreviewProps {
  employerId: number;
}

function EmployerReviewsPreview({ employerId }: EmployerReviewsPreviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getEmployerReviewsById(employerId);
        console.log(data);
        setReviews(data);
      } catch (error) {
        console.error("Kunde inte hämta betyg", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [employerId]);

  if (isLoading) {
    return (
      <section className="reviews-preview">
        <header className="reviews-preview__header">
          <h2 className="reviews-preview__title">Senaste betygen</h2>
        </header>
        <div className="reviews-preview__skeleton skeleton" />
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
            <li key={review.id} className="reviews-preview__item">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default EmployerReviewsPreview;
