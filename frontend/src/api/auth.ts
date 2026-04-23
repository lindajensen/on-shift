const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Registers a new worker user by sending a POST request to the backend API.
 * @param data - An object containing the worker's first name, last name, email, password, and role.
 * @returns  A promise that resolves when the worker has been successfully registered.
 * @throws An error if the registration fails.
 */
export async function registerWorker(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "worker" | "employer";
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Kunde inte registrera användaren. Försök igen senare.");
  }

  return response.json();
}

/**
 * Registers a new employer by sending a POST request to the backend API.
 * @param data - An object containing the employer's restaurant name, email, password, and role.
 * @returns  A promise that resolves when the employer has been successfully registered.
 * @throws An error if the registration fails.
 */
export async function registerEmployer(data: {
  restaurantName: string;
  email: string;
  password: string;
  role: "worker" | "employer";
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Kunde inte registrera användaren. Försök igen senare.");
  }

  return response.json();
}

//TODO: Replace with real API calls when backend is ready
export async function loginUser(data: { email: string; password: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
