/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import pool from "../db";

/**
 * Toggles the availability status of the logged in worker.
 * @param request - The request object containing the new availability status in the body.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result.
 */
export async function toggleAvailability(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { isAvailable } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  await pool.query(
    "UPDATE worker_profile SET is_available = $1 WHERE user_id = $2",
    [isAvailable, userId],
  );

  response.status(200).json({ message: "Tillgänglighet uppdaterad" });
}

/**
 * Fetches the profile information of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the worker's profile information.
 */
export async function getWorkerProfile(request: Request, response: Response) {
  const user = request.user;

  if (!user) {
    return response.status(401).json({ message: "Åtkomst nekad" });
  }

  const userId = user.userId;

  try {
    const profile = await pool.query(
      "SELECT * FROM worker_profile WHERE user_id = $1",
      [userId],
    );

    response.status(200).json(profile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches the applications of the currently logged in worker.
 * @param request
 * @param response
 * @returns A JSON array of the worker's applications.
 */
export async function getWorkerApplications(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  try {
    const applications = await pool.query(
      `
      SELECT
        a.id,
        a.status,
        j.role,
        j.job_date,
        j.start_time,
        j.end_time,
        ep.name AS restaurant_name
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      JOIN worker_profile wp ON a.worker_id = wp.id
      WHERE wp.user_id = $1
      ORDER BY a.created_at ASC
      `,
      [userId],
    );

    response.status(200).json(applications.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches recommended jobs for the currently logged in worker based on their roles and past applications.
 * @param request
 * @param response
 * @returns A JSON array of recommended jobs for the worker.
 */
export async function getRecommendedJobs(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  try {
    const recommendedJobs = await pool.query(
      `
      SELECT
        j.id,
        j.role,
        j.job_date,
        j.start_time,
        j.end_time,
        j.compensation,
        ep.name AS restaurant_name,
        ep.address AS location
      FROM job j
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE j.role IN (
        SELECT role FROM worker_role
        WHERE worker_id = (SELECT id FROM worker_profile WHERE user_id = $1)
      )
      AND j.job_date >= CURRENT_DATE
      AND j.id NOT IN (
        SELECT job_id FROM application
        WHERE worker_id = (SELECT id FROM worker_profile WHERE user_id = $1)
      )
      ORDER BY j.job_date ASC
      `,
      [userId],
    );

    response.status(200).json(recommendedJobs.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches the reviews of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of the worker's reviews, including the reviewer's name, rating, comment, and creation date.
 */
export async function getWorkerReviews(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  try {
    const reviews = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        ep.name AS reviewer_name,
        j.role,
        j.job_date
      FROM review r
      JOIN employer_profile ep ON r.reviewer_id = ep.user_id
      JOIN job j ON r.job_id = j.id
      WHERE r.reviewee_id = $1
      ORDER BY r.created_at DESC
    `,
      [userId],
    );

    response.status(200).json(reviews.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
