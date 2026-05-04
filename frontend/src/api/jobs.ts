import { PublicJobListing } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all job listings from the API.
 * @returns A promise that resolves to an array of PublicJobListing objects.
 * @throws An error if the fetch operation fails.
 */
export async function getAllJobs(): Promise<PublicJobListing[]> {
  const response = await fetch(`${API_BASE_URL}/api/jobs`);

  if (!response.ok) {
    throw new Error("Kunde inte hämta pass. Försök igen senare.");
  }

  return response.json();
}

/**
 * Fetches the details of a specific job listing by its ID.
 * @param id - The ID of the job listing to fetch.
 * @returns A promise that resolves to a PublicJobListing object containing the job details.
 * @throws An error if the fetch operation fails or if the job listing is not found.
 */
export async function getJobById(id: number): Promise<PublicJobListing> {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);

  if (!response.ok) {
    throw new Error("Kunde inte hämta pass. Försök igen senare.");
  }

  return response.json();
}
