import {
  WorkerProfile,
  JobPreview,
  Review,
  ReviewData,
  SavedJob,
  WorkerContactFormData,
  WorkerAboutFormData,
  WorkerRole,
  WorkerAvailabilityFormData,
  WorkerExperience,
  WorkerEducation,
  SavedEmployer,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the profile of the currently logged in worker.
 * @returns A promise that resolves to the worker's profile.
 * @throws An error if the request fails.
 */
export async function getWorkerProfileByUserId(): Promise<WorkerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/profile/me`, {
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
 * Fetches the profile of a worker by their ID.
 * @param id - The ID of the worker profile to fetch.
 * @returns A promise that resolves to the worker's profile.
 * @throws An error if the request fails.
 */
export async function getWorkerProfileById(id: number): Promise<WorkerProfile> {
  const response = await fetch(`${API_BASE_URL}/api/workers/profile/${id}`);

  if (!response.ok) {
    throw new Error("Kunde inte hämta profilen. Försök igen senare.");
  }

  return response.json();
}

/**
 * Updates the contact information of the currently logged in worker with the provided data.
 * @param data - The data to update the contact information with.
 * @returns A promise that resolves to the updated worker contact information.
 * @throws An error if the request fails.
 */
export async function updateWorkerContact(
  data: WorkerContactFormData,
): Promise<WorkerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/profile/contact`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      "Kunde inte uppdatera kontaktuppgifter. Försök igen senare.",
    );
  }

  return response.json();
}

/**
 * Updates the bio of the currently logged in worker with the provided data.
 * @param data - The data to update the bio with.
 * @returns A promise that resolves to the updated worker bio.
 * @throws An error if the request fails.
 */
export async function updateWorkerBio(
  data: WorkerAboutFormData,
): Promise<WorkerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/profile/bio`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera beskrivning. Försök igen senare.");
  }

  return response.json();
}

/**
 * Replaces all experience entries for the currently logged in worker.
 * @param data - The experience data to save.
 * @returns A promise that resolves when the experience has been updated.
 * @throws An error if the request fails.
 */
export async function updateWorkerExperience(
  data: WorkerExperience[],
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/workers/profile/experience`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera erfarenhet. Försök igen senare.");
  }
}

/**
 * Replaces all education entries for the currently logged in worker.
 * @param data - The education data to save.
 * @returns A promise that resolves when the education has been updated.
 * @throws An error if the request fails.
 */
export async function updateWorkerEducation(
  data: WorkerEducation[],
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/workers/profile/education`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera utbildning. Försök igen senare.");
  }
}

/**
 * Replaces all roles entries for the currently logged in worker.
 * @param data - The roles data to save.
 * @returns A promise that resolves when the roles have been updated.
 * @throws An error if the request fails.
 */
export async function updateWorkerRoles(data: WorkerRole[]): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/profile/roles`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera roller. Försök igen senare.");
  }
}

/**
 * Replaces all availability entries for the currently logged in worker.
 * @param data - The availability data to save.
 * @returns A promise that resolves when availability has been updated.
 * @throws An error if the request fails.
 */
export async function updateWorkerAvailability(
  data: WorkerAvailabilityFormData,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/workers/profile/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera tillgänglighet. Försök igen senare.");
  }
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
 * Fetches all reviews for a worker by their ID.
 * @param workerId - The ID of the worker whose reviews to fetch.
 * @returns A promise that resolves to an array of reviews.
 * @throws An error if the request fails.
 */
export async function getWorkerReviewsById(
  workerId: number,
): Promise<Review[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/workers/profile/${workerId}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta betyg. Försök igen senare.");
  }

  return response.json();
}

/**
 * Creates a review for an employer after a completed shift.
 * @param jobId - The ID of the job the review is for.
 * @param revieweeId - The employer profile ID being reviewed.
 * @param rating - The rating given (1-5).
 * @param comment - The review comment.
 * @returns A promise that resolves when the review has been saved.
 * @throws An error if the request fails.
 */
export async function createReview(reviewData: ReviewData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error("Kunde inte spara betyg. Försök igen senare.");
  }
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
 * @returns A promise that resolves when the job is saved.
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

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-jobs`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobId: id }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte ta bort sparat pass. Försök igen senare.");
  }
}

/**
 * Fetches saved employers for the currently logged in worker.
 * @returns A promise that resolves to an array of saved employer previews.
 * @throws An error if the request fails.
 */
export async function getSavedEmployers(): Promise<SavedEmployer[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-employers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      "Kunde inte hämta sparade restauranger. Försök igen senare.",
    );
  }

  return response.json();
}

/**
 * Saves an employer to the currently logged in worker's list of saved employers.
 * @param id - The ID of the employer to save.
 * @returns A promise that resolves when the employer is saved.
 * @throws An error if the request fails.
 */
export async function saveEmployer(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-employers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ employerId: id }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte spara restaurang. Försök igen senare.");
  }
}

/**
 * Deletes an employer from the currently logged in worker's list of saved employers.
 * @param id - The ID of the employer to unsave.
 * @returns A promise that resolves when the employer is unsaved.
 * @throws An error if the request fails.
 */
export async function unsaveEmployer(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/saved-employers`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ employerId: id }),
  });

  if (!response.ok) {
    throw new Error(
      "Kunde inte ta bort sparad restaurang. Försök igen senare.",
    );
  }
}

/**
 * Fetches the URL of the currently logged in worker's CV.
 * @returns A promise that resolves to the URL of the worker's CV.
 * @throws An error if the request fails.
 */
export async function getCVUrl(): Promise<string> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/cv/url`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta CV. Försök igen senare.");
  }

  const data = await response.json();
  return data.url;
}

/**
 * Uploads a CV file for the currently logged in worker.
 * @param file - The CV file to upload.
 * @returns A promise that resolves when the CV has been uploaded.
 * @throws An error if the request fails.
 */
export async function uploadCV(file: File) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("cv", file);

  const response = await fetch(`${API_BASE_URL}/api/workers/cv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Kunde inte ladda upp CV. Försök igen senare.");
  }

  return response.json();
}

/**
 * Deletes the CV of the currently logged in worker.
 * @returns A promise that resolves when the CV has been deleted.
 * @throws An error if the request fails.
 */
export async function deleteCV(): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/cv`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte ta bort CV. Försök igen senare.");
  }
}
