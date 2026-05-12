import { Request, Response } from "express";
import pool from "../db";

/**
 * Fetches all active job listings along with their associated restaurant information.
 * @param _request - The request object (not used in this function).
 * @param response - The response object.
 * @return A JSON array of job listings with restaurant details, or an error message if something goes wrong.
 */
export async function getAllJobs(
  _request: Request,
  response: Response,
): Promise<void> {
  try {
    const jobs = await pool.query(
      `
      SELECT
        j.id,
        j.role,
        j.job_date,
        j.start_time,
        j.end_time,
        j.compensation,
        j.available_slots,
        j.description,
        j.demands,
        j.is_urgent,
        j.requires_experience,
        j.created_at,
        ep.name AS restaurant_name,
        ep.city AS location
      FROM job j
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE j.status = 'active'
      ORDER BY j.job_date ASC
      `,
    );

    response.status(200).json(jobs.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches a specific job listing by its ID, including detailed information about the job and the associated restaurant.
 * @param request - The request object.
 * @param response - The response object.
 * @return A JSON object containing the job details, or an error message if something goes wrong.
 */
export async function getJobById(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;

  try {
    const job = await pool.query(
      `
     SELECT
      j.id,
      j.role,
      j.job_date,
      j.start_time,
      j.end_time,
      j.compensation,
      j.available_slots,
      j.description,
      j.demands,
      j.is_urgent,
      j.requires_experience,
      j.created_at,
      ep.id AS employer_id,
      ep.name AS restaurant_name,
      ep.city,
      CASE
        WHEN ep.street IS NOT NULL AND ep.postal_code IS NOT NULL AND ep.city IS NOT NULL
        THEN CONCAT(ep.street, ', ', ep.postal_code, ' ', ep.city)
        WHEN ep.city IS NOT NULL THEN ep.city
        ELSE NULL
      END AS location,
      (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM review r WHERE r.reviewee_id = ep.user_id) AS rating
    FROM job j
    JOIN employer_profile ep ON j.employer_id = ep.id
    WHERE j.id = $1
      `,
      [id],
    );

    response.status(200).json(job.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
