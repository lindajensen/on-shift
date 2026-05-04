import { WorkerProfile, JobPreview, Review, SavedJob } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the profile of the currently logged in worker.
 * @returns A promise that resolves to the worker's profile.
 * @throws An error if the request fails.
 */
export async function getWorkerProfile(): Promise<WorkerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta profilen. Försök igen senare.");
  }

  return response.json();
}

/**
 * Toggles the availability status of the currently logged in worker.
 * @param isAvailable - The new availability status.
 * @throws An error if the request fails.
 */
export async function toggleAvailability(isAvailable: boolean): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/availability`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isAvailable }),
  });

  if (!response.ok) {
    throw new Error(
      "Kunde inte uppdatera tillgängligheten. Försök igen senare.",
    );
  }
}

/**
 * Fetches recommended jobs for the currently logged in worker based on their roles.
 * @returns A promise that resolves to an array of job previews.
 * @throws An error if the request fails.
 */
export async function getRecommendedJobs(): Promise<JobPreview[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/recommended-jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      "Kunde inte hämta rekommenderade jobb. Försök igen senare.",
    );
  }

  return response.json();
}

/**
 * Fetches all reviews for the currently logged in worker.
 * @returns A promise that resolves to an array of reviews.
 * @throws An error if the request fails.
 */
export async function getWorkerReviews(): Promise<Review[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta betyg. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches the list of jobs that the currently logged in worker has saved.
 * @returns A promise that resolves to an array of saved job previews.
 * @throws An error if the request fails.
 */
export async function getSavedJobs(): Promise<SavedJob[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta sparade pass. Försök igen senare.");
  }

  return response.json();
}

/**
 * Saves a job to the currently logged in worker's list of saved jobs.
 * @param id - The ID of the job to save.
 * @returns A promise that resolves to the saved job preview.
 * @throws An error if the request fails.
 */
export async function saveJob(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobId: id }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte spara pass. Försök igen senare.");
  }
}

/**
 * Deletes a job from the currently logged in worker's list of saved jobs.
 * @param id - The ID of the job to unsave.
 * @returns A promise that resolves when the job is unsaved.
 * @throws An error if the request fails.
 */
export async function unsaveJob(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-jobs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte ta bort sparat pass. Försök igen senare.");
  }
}
