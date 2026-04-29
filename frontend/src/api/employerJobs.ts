import {
  EmployerJobListing,
  EmployerApplicationPreview,
  JobFormData,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
