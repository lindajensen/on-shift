import { EmployerJobListing, EmployerApplicationPreview } from "../types";

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
