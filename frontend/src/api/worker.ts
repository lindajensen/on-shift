import { WorkerProfile } from "../types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
