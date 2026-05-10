/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import pool from "../db";

/**
 * Fetches the profile of an worker by their worker profile ID.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the employer's profile information.
 */
export async function getWorkerProfileById(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;

  try {
    const workerProfile = await pool.query(
      `
      SELECT
        wp.id,
        wp.user_id,
        wp.name,
        wp.bio,
        wp.email,
        wp.phone,
        wp.city,
        wp.cv_url,
        wp.is_available,
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
        JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) AS availability,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM worker_profile wp
      LEFT JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN availability a ON a.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      WHERE wp.id = $1
      GROUP BY wp.id, wp.user_id, wp.name, wp.bio, wp.email, wp.phone, wp.city, wp.cv_url, wp.is_available
      `,
      [id],
    );

    response.status(200).json(workerProfile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches the profile of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the worker's profile information.
 */
export async function getWorkerProfileByUserId(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });
    return;
  }

  const userId = user.id;

  try {
    const workerProfile = await pool.query(
      `
      SELECT
        wp.id,
        wp.user_id,
        wp.name,
        wp.bio,
        wp.email,
        wp.phone,
        wp.city,
        wp.cv_url,
        wp.is_available,
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
        JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) AS availability,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM worker_profile wp
      LEFT JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN availability a ON a.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      WHERE wp.user_id = $1
      GROUP BY wp.id, wp.user_id, wp.name, wp.bio, wp.email, wp.phone, wp.city, wp.cv_url, wp.is_available
      `,
      [userId],
    );

    response.status(200).json(workerProfile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Updates the profile of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the updated worker profile.
 */
export async function updateWorkerProfile(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const data = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    const updatedProfile = await pool.query(
      `
      UPDATE worker_profile
      SET
        email = COALESCE($1, email),
        phone = COALESCE($2, phone),
        city = COALESCE($3, city),
        bio = COALESCE($4, bio)
      WHERE user_id = $5
      RETURNING *
      `,
      [
        data.email ?? null,
        data.phone ?? null,
        data.city ?? null,
        data.bio ?? null,
        userId,
      ],
    );

    response.status(200).json(updatedProfile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Toggles the availability status of the logged in worker.
 * @param request - The request object.
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

  const userId = user.id;

  await pool.query(
    "UPDATE worker_profile SET is_available = $1 WHERE user_id = $2",
    [isAvailable, userId],
  );

  response.status(200).json({ message: "Tillgänglighet uppdaterad" });
}

/**
 * Fetches the availability status of the logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the worker's availability status.
 */
export async function getAvailability(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    const availability = await pool.query(
      `
      SELECT day_of_week, start_time, end_time
      FROM availability
      WHERE worker_id = (SELECT id FROM worker_profile WHERE user_id = $1)
      ORDER BY day_of_week`,
      [userId],
    );

    response.status(200).json(availability.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

// TODO: Refactor: remove getWorkerProfile (check where it's used)
/**
 * Fetches the profile information of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the worker's profile information.
 */
export async function getWorkerProfile(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

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
 * @param request - The request object.
 * @param response - The response object.
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

  const userId = user.id;

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
 * @param request - The request object.
 * @param response - The response object.
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

  const userId = user.id;

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
        CASE
          WHEN ep.street IS NOT NULL AND ep.postal_code IS NOT NULL AND ep.city IS NOT NULL
          THEN CONCAT(ep.street, ', ', ep.postal_code, ' ', ep.city)
          WHEN ep.city IS NOT NULL THEN ep.city
          ELSE NULL
        END AS location
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

  const userId = user.id;

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

/**
 * Fetches the saved jobs of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of the worker's saved jobs, including job details and restaurant information.
 */
export async function getSavedJobs(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    const savedJobs = await pool.query(
      `
      SELECT
        sj.id AS saved_id,
        sj.created_at,
        j.id AS job_id,
        j.role,
        j.job_date,
        j.start_time,
        j.end_time,
        j.compensation,
        j.is_urgent,
        j.requires_experience,
        ep.name AS restaurant_name,
        CASE
          WHEN ep.street IS NOT NULL AND ep.postal_code IS NOT NULL AND ep.city IS NOT NULL
          THEN CONCAT(ep.street, ', ', ep.postal_code, ' ', ep.city)
          WHEN ep.city IS NOT NULL THEN ep.city
          ELSE NULL
        END AS location
      FROM saved_job sj
      JOIN job j ON sj.job_id = j.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE sj.worker_id = (SELECT id FROM worker_profile WHERE user_id = $1)
      ORDER BY sj.created_at DESC
    `,
      [userId],
    );

    response.status(200).json(savedJobs.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Saves a job to the currently logged in worker's list of saved jobs.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the save operation.
 */
export async function saveJob(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { jobId } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      INSERT INTO saved_job (worker_id, job_id)
      VALUES (
        (SELECT id FROM worker_profile WHERE user_id = $1),
        $2
      )
      `,
      [userId, jobId],
    );

    response.status(201).json({ message: "Passet har sparats" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Removes a saved job from the currently logged in worker's list of saved jobs.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the unsave operation.
 */
export async function unsaveJob(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { jobId } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      DELETE FROM saved_job
      WHERE job_id = $1
      AND worker_id = (SELECT id FROM worker_profile WHERE user_id = $2)
      `,
      [jobId, userId],
    );

    response.status(201).json({ message: "Passet har tagits bort" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
