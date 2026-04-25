import { JobListingPreview } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all job listings for the currently logged-in employer.
 * @returns A promise that resolves to an array of job listings.
 * @throws An error if the request fails.
 */
export async function getAllJobListings(): Promise<JobListingPreview[]> {
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
