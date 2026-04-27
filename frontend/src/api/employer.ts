import { SavedWorkerPreview, Review } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches saved workers for the currently logged in restaurant.
 * @returns A promise that resolves to an array of saved worker previews.
 * @throws An error if the request fails.
 */
export async function getSavedWorkers(): Promise<SavedWorkerPreview[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/saved-workers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta sparad personal. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches all reviews for the currently logged in restaurant.
 * @returns A promise that resolves to an array of reviews.
 * @throws An error if the request fails.
 */
export async function getEmployerReviews(): Promise<Review[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta betyg. Försök igen senare.");
  }

  return response.json();
}
