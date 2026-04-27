import { WorkerApplicationPreview } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all applications for the currently logged-in worker.
 * @returns A promise that resolves to an array of applications.
 * @throws An error if the request fails.
 */
export async function getAllApplications(): Promise<
  WorkerApplicationPreview[]
> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/workers/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta ansökningar. Försök igen senare.");
  }

  return response.json();
}
