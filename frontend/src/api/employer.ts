import { SavedWorkerPreview, Review, Worker } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all workers.
 * @returns A promise that resolves to an array of workers.
 * @throws An error if the request fails.
 */
export async function getAllWorkers(): Promise<Worker[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/workers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response) {
    throw new Error("Kunde inte hämta sparad personal. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches a random selection of workers.
 * @returns A promise that resolves to an array of workers.
 * @throws An error if the request fails.
 */
export async function getRandomWorkers() {
  const response = await fetch(`${API_BASE_URL}/api/employers/workers/random`);

  if (!response.ok) {
    throw new Error("Kunde inte hämta personal");
  }

  return response.json();
}

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
 * Saves a worker to the currently logged in restaurant's list of saved workers.
 * @param id - The ID of the worker to save.
 * @returns A promise that resolves when the worker is saved.
 * @throws An error if the request fails.
 */
export async function saveWorker(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/saved-workers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ workerId: id }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte spara personal. Försök igen senare.");
  }
}

/**
 * Deletes a worker from the currently logged in restaurant's list of saved workers.
 * @param id - The ID of the worker to unsave.
 * @returns A promise that resolves when the worker is unsaved.
 * @throws An error if the request fails.
 */
export async function unsaveWorker(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/saved-workers`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ workerId: id }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte ta bort sparad personal. Försök igen senare.");
  }
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
