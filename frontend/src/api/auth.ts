import { LoginResponse } from "../types";

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
}): Promise<{ message: string }> {
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
}): Promise<{ message: string }> {
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
 * Logs in a user by sending a POST request to the backend API with the user's email and password.
 * @param data - An object containing the user's email and password.
 * @returns A promise that resolves to an object containing the JWT token and user information if the login is successful.
 * @throws An error if the login fails.
 */
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Felaktigt användarnamn eller lösenord");
    }
    throw new Error("Kunde inte logga in");
  }

  const loginData = await response.json();

  localStorage.setItem("token", loginData.token);

  return loginData;
}
