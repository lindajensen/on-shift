import {
  Worker,
  Review,
  EmployerProfile,
  EditContactFormData,
  EditAboutFormData,
  EmployerPublicJob,
  EmployerJobListing,
  EmployerJobDetails,
  EmployerApplicationPreview,
  JobFormData,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the profile of the currently logged in employer.
 * @returns A promise that resolves to the employer's profile.
 * @throws An error if the request fails.
 */
export async function getEmployerProfileByUserId(): Promise<EmployerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/profile/me`, {
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
 * Fetches the profile of an employer by their ID.
 * @param id - The ID of the employer profile to fetch.
 * @returns A promise that resolves to the employer's profile.
 * @throws An error if the request fails.
 */
export async function getEmployerProfileById(
  id: number,
): Promise<EmployerProfile> {
  const response = await fetch(`${API_BASE_URL}/api/employers/profile/${id}`);

  if (!response.ok) {
    throw new Error("Kunde inte hämta profilen. Försök igen senare.");
  }

  return response.json();
}

/**
 * Updates the contact information of the currently logged in employer with the provided data.
 * @param data - The data to update the employer contact information with. Can be either contact information or about information.
 * @returns A promise that resolves to the updated employer contact information.
 * @throws An error if the request fails.
 */
export async function updateEmployerContact(
  data: EditContactFormData,
): Promise<EmployerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/profile/contact`,
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
    throw new Error(
      "Kunde inte uppdatera kontaktuppgifter. Försök igen senare.",
    );
  }

  return response.json();
}

/**
 * Updates the description of the currently logged in employer with the provided data.
 * @param data - The data to update the employer description with. Can be either contact information or about information.
 * @returns A promise that resolves to the updated employer description.
 * @throws An error if the request fails.
 */
export async function updateEmployerDescription(
  data: EditAboutFormData,
): Promise<EmployerProfile> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/profile/description`,
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
    throw new Error("Kunde inte uppdatera beskrivningen. Försök igen senare.");
  }

  return response.json();
}

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

  if (!response.ok) {
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
export async function getSavedWorkers(): Promise<Worker[]> {
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

/**
 * Fetches all reviews for an employer by their ID.
 * @param workerId - The ID of the employer whose reviews to fetch.
 * @returns A promise that resolves to an array of reviews.
 * @throws An error if the request fails.
 */
export async function getEmployerReviewsById(
  employerId: number,
): Promise<Review[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/profile/${employerId}/reviews`,
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
 * Fetches all job listings for a given employer.
 * @param employerId - The ID of the employer to fetch job listings for.
 * @returns A promise that resolves to an array of job listings.
 * @throws An error if the request fails.
 */
export async function getEmployerJobListings(
  employerId: number,
): Promise<EmployerPublicJob[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/profile/${employerId}/jobs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta pass. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches all job listings for the currently logged-in employer.
 * @returns A promise that resolves to an array of job listings.
 * @throws An error if the request fails.
 */
export async function getAllJobListings(): Promise<EmployerJobListing[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta annonser. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches the details of a specific job listing by its ID.
 * @param id - The ID of the job listing to fetch.
 * @returns A promise that resolves to the job listing details.
 * @throws An error if the request fails.
 */
export async function getJobDetails(id: number): Promise<EmployerJobDetails> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta annonsen. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches all applications submitted to the logged in restaurants's job listings.
 * @returns A promise that resolves to an array of restaurant applications.
 * @throws An error if the request fails.
 */
export async function getJobApplications(): Promise<
  EmployerApplicationPreview[]
> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta ansökningar. Försök igen senare.");
  }

  return response.json();
}

/**
 * Creates a new job listing for the logged in restaurant.
 * @param jobData - The data for the new job listing.
 * @returns A promise that resolves to the created job listing.
 * @throws An error if the request fails.
 */
export async function createJobListing(
  jobData: JobFormData,
): Promise<EmployerJobListing> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error("Kunde inte skapa annonsen. Försök igen senare.");
  }

  return response.json();
}

/**
 * Updates an existing job listing with new data.
 * @param jobData - The updated data for the job listing.
 * @param id - The ID of the job listing to update.
 * @returns A promise that resolves to the updated job listing.
 * @throws An error if the request fails.
 */
export async function updateJobListing(jobData: JobFormData, id: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  return response.json();
}

/**
 * Closes a job listing by its ID, changing its status to "closed".
 * @param id - The ID of the job listing to close.
 * @returns A promise that resolves when the job listing is closed.
 * @throws An error if the request fails.
 */
export async function closeJobListing(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/jobs/${id}/close`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte avsluta annonsen");
  }
}

/**
 * Reopens a job listing by its ID, changing its status to "active".
 * @param id - The ID of the job listing to close.
 * @returns A promise that resolves when the job listing is reopen.
 * @throws An error if the request fails.
 */
export async function reopenJobListing(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/jobs/${id}/reopen`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte avsluta annonsen");
  }
}

/**
 * Deletes a job listing by its ID.
 * @param id - The ID of the job listing to delete.
 * @returns A promise that resolves when the job listing is deleted.
 * @throws An error if the request fails.
 */
export async function deleteJobListing(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/employers/jobs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte ta bort annonsen. Försök igen senare.");
  }
}

/**
 * Hires an applicant for a job listing by the application ID, changing the status of the application to "hired".
 * @param id - The ID of the application to hire.
 * @returns A promise that resolves when the applicant is hired.
 * @throws An error if the request fails.
 */
export async function hireApplicant(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/applications/${id}/hire`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte godkänna ansökan. Försök igen senare.");
  }
}

/**
 * Rejects an applicant for a job listing by the application ID, changing the status of the application to "rejected".
 * @param id - The ID of the application to reject.
 * @returns A promise that resolves when the applicant is rejected.
 * @throws An error if the request fails.
 */
export async function rejectApplicant(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/employers/applications/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte neka ansökan. Försök igen senare.");
  }
}
