import { Request, Response } from "express";
import pool from "../db";

/**
 * Fetches the job listings of the currently logged in restaurant.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of the restaurant's job listings.
 */
export async function getJobListings(
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
    const listings = await pool.query(
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
        j.is_urgent,
        j.requires_experience,
        j.status,
        COUNT(a.id) AS application_count
      FROM job j
      LEFT JOIN application a ON a.job_id = j.id
      JOIN employer_profile ep ON ep.id = j.employer_id
      WHERE ep.user_id = $1
      GROUP BY j.id
      ORDER BY j.job_date ASC
      `,
      [userId],
    );

    response.status(200).json(listings.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches all applications submitted to the logged in restaurants's job listings.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of applications with worker name, job details and status.
 */
export async function getEmployerApplications(
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
        wp.name AS worker_name
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN worker_profile wp ON a.worker_id = wp.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE ep.user_id = $1
      ORDER BY a.created_at DESC
      `,
      [userId],
    );

    response.status(200).json(applications.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches the saved workers for the currently logged in restaurant.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of saved workers with roles and average rating.
 */
export async function getSavedWorkers(
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
    const savedWorkers = await pool.query(
      `
      SELECT
        wp.id,
        wp.name AS worker_name,
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
        AVG(r.rating) AS rating
      FROM saved_worker sw
      JOIN worker_profile wp ON sw.worker_id = wp.id
      JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      JOIN employer_profile ep ON sw.employer_id = ep.id
      WHERE ep.user_id = $1
      GROUP BY wp.id, wp.name;
      `,
      [userId],
    );

    response.status(200).json(savedWorkers.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches all reviews left for the currently logged in restaurant.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of reviews with reviewer name, rating, comment and job details.
 */
export async function getEmployerReviews(
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
        wp.name AS reviewer_name,
        j.role,
        j.job_date
      FROM review r
      JOIN worker_profile wp ON r.reviewer_id = wp.user_id
      JOIN job j ON r.job_id = j.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE ep.user_id = $1
      ORDER BY r.created_at DESC
      `,
      [userId],
    );

    response.status(200).json(reviews.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Creates a new job listing for the currently logged in employer.
 * @param request - The request object containing the job data.
 * @param response - The response object.
 * @returns A JSON object of the newly created job listing.
 */
export async function createJobListing(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  const {
    role,
    date,
    startTime,
    endTime,
    compensation,
    availableSlots,
    description,
    isUrgent,
    requires_experience,
  } = request.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO job (employer_id, role, description, compensation, job_date, start_time, end_time, available_slots, is_urgent, requires_experience)
      VALUES (
        (SELECT id FROM employer_profile WHERE user_id = $1),
        $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING *
      `,
      [
        userId,
        role,
        description,
        compensation,
        date,
        startTime,
        endTime,
        availableSlots,
        isUrgent,
        requires_experience,
      ],
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Deletes a job listing if it belongs to the currently logged in restaurant.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A success message if the listing was deleted, or an error message if something went wrong.
 */
export async function deleteJobListing(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { id } = request.params;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  try {
    await pool.query(
      `DELETE FROM job WHERE id = $1 AND employer_id = (SELECT id FROM employer_profile WHERE user_id = $2)`,
      [id, userId],
    );

    response.status(200).json({ message: "Annonsen har tagits bort" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
