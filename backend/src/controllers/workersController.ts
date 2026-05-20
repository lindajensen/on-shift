/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import multer from "multer";
import pool from "../db";
import supabase from "../supabase";

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
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) FILTER (WHERE wr.id IS NOT NULL) AS roles,
        JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) FILTER (WHERE a.id IS NOT NULL) AS availability,
        JSON_AGG(DISTINCT jsonb_build_object('id', we.id, 'job_title', we.job_title, 'workplace', we.workplace, 'start_date', we.start_date, 'end_date', we.end_date)) FILTER (WHERE we.id IS NOT NULL) AS experience,
        JSON_AGG(DISTINCT jsonb_build_object('id', wed.id, 'school', wed.school, 'program', wed.program, 'graduation_year', wed.graduation_year)) FILTER (WHERE wed.id IS NOT NULL) AS education,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM worker_profile wp
      LEFT JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN availability a ON a.worker_id = wp.id
      LEFT JOIN worker_experience we ON we.worker_id = wp.id
      LEFT JOIN worker_education wed ON wed.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      WHERE wp.id = $1
      GROUP BY wp.id, wp.user_id, wp.name, wp.bio, wp.email, wp.phone, wp.city, wp.cv_url, wp.is_available
      `,
      [id],
    );

    response.status(200).json(workerProfile.rows[0]);
  } catch (error) {
    console.error(error);
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
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) FILTER (WHERE wr.id IS NOT NULL) AS roles,
        JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) FILTER (WHERE a.id IS NOT NULL) AS availability,
        JSON_AGG(DISTINCT jsonb_build_object('id', we.id, 'job_title', we.job_title, 'workplace', we.workplace, 'start_date', we.start_date, 'end_date', we.end_date)) FILTER (WHERE we.id IS NOT NULL) AS experience,
        JSON_AGG(DISTINCT jsonb_build_object('id', wed.id, 'school', wed.school, 'program', wed.program, 'graduation_year', wed.graduation_year)) FILTER (WHERE wed.id IS NOT NULL) AS education,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM worker_profile wp
      LEFT JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN availability a ON a.worker_id = wp.id
      LEFT JOIN worker_experience we ON we.worker_id = wp.id
      LEFT JOIN worker_education wed ON wed.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      WHERE wp.user_id = $1
      GROUP BY wp.id, wp.user_id, wp.name, wp.bio, wp.email, wp.phone, wp.city, wp.cv_url, wp.is_available
      `,
      [userId],
    );

    response.status(200).json(workerProfile.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Updates the contact information of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the updated worker contact information.
 */
export async function updateWorkerContact(
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
    const updatedContact = await pool.query(
      `
      UPDATE worker_profile
      SET
        email = $1,
        phone = $2,
        city = $3
      WHERE user_id = $4
      RETURNING *
      `,
      [data.email || null, data.phone || null, data.city || null, userId],
    );

    response.status(200).json(updatedContact.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Updates the bio of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the updated worker's bio.
 */
export async function updateWorkerBio(
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
    const updatedBio = await pool.query(
      `
      UPDATE worker_profile
      SET
        bio = $1
      WHERE user_id = $2
      RETURNING *
      `,
      [data.bio || null, userId],
    );

    response.status(200).json(updatedBio.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Replaces all experience entries for the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON message indicating the result of the update operation.
 */
export async function updateWorkerExperience(
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
    await pool.query("BEGIN");

    const workerResult = await pool.query(
      `
      SELECT id FROM worker_profile WHERE user_id = $1
      `,
      [userId],
    );

    const workerId = workerResult.rows[0].id;

    await pool.query(
      `
      DELETE FROM worker_experience WHERE worker_id = $1
      `,
      [workerId],
    );

    for (const entry of data) {
      await pool.query(
        `
        INSERT INTO worker_experience (worker_id, job_title, workplace, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5)
         `,
        [
          workerId,
          entry.job_title,
          entry.workplace,
          entry.start_date,
          entry.end_date || null,
        ],
      );
    }

    await pool.query("COMMIT");

    response.status(200).json({ message: "Erfarenhet uppdaterad" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Replaces all education entries for the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON message indicating the result of the update operation.
 */
export async function updateWorkerEducation(
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
    await pool.query("BEGIN");

    const workerResult = await pool.query(
      `
      SELECT id FROM worker_profile WHERE user_id = $1
      `,
      [userId],
    );

    const workerId = workerResult.rows[0].id;

    await pool.query(
      `
      DELETE FROM worker_education WHERE worker_id = $1
      `,
      [workerId],
    );

    for (const entry of data) {
      await pool.query(
        `
        INSERT INTO worker_education (worker_id, school, program, graduation_year)
         VALUES ($1, $2, $3, $4)
         `,
        [workerId, entry.school, entry.program, entry.graduation_year],
      );
    }

    await pool.query("COMMIT");

    response.status(200).json({ message: "Utbildning uppdaterad" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Replaces all role entries for the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON message indicating the result of the update operation.
 */
export async function updateWorkerRoles(
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
    await pool.query("BEGIN");

    const workerResult = await pool.query(
      `
      SELECT id FROM worker_profile WHERE user_id = $1
      `,
      [userId],
    );

    const workerId = workerResult.rows[0].id;

    await pool.query(
      `
      DELETE FROM worker_role WHERE worker_id = $1
      `,
      [workerId],
    );

    for (const entry of data) {
      await pool.query(
        `
        INSERT INTO worker_role (worker_id, role, experience_level)
         VALUES ($1, $2, $3)
         `,
        [workerId, entry.role, entry.experience_level],
      );
    }

    await pool.query("COMMIT");

    response.status(200).json({ message: "Roller uppdaterade" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Replaces all availability entries for the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON message indicating the result of the update operation.
 */
export async function updateWorkerAvailability(
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
    await pool.query("BEGIN");

    const workerResult = await pool.query(
      `
      SELECT id FROM worker_profile WHERE user_id = $1
      `,
      [userId],
    );

    const workerId = workerResult.rows[0].id;

    await pool.query(
      `
      DELETE FROM availability WHERE worker_id = $1
      `,
      [workerId],
    );

    for (const entry of data.availability) {
      await pool.query(
        `
        INSERT INTO availability (worker_id, day_of_week, start_time, end_time)
         VALUES ($1, $2, $3, $4)
         `,
        [workerId, entry.day_of_week, entry.start_time, entry.end_time],
      );
    }

    await pool.query("COMMIT");

    response.status(200).json({ message: "Tillgänglighet uppdaterad" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
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
        ep.name AS restaurant_name,
        ep.id AS employer_id,
        j.id AS job_id,
        EXISTS (
          SELECT 1 FROM review r
          WHERE r.job_id = a.job_id
          AND r.reviewer_id = wp.user_id
        ) AS has_review
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      JOIN worker_profile wp ON a.worker_id = wp.id
      WHERE wp.user_id = $1
      ORDER BY j.job_date ASC
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
        j.is_urgent,
        j.requires_experience,
        j.created_at,
        ep.name AS restaurant_name,
        ep.city AS location
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
      AND j.status = 'active'
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
 * Fetches the 3 most recent reviews of a worker by their worker profile ID.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of the worker's reviews.
 */
export async function getWorkerReviewsById(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;

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
      JOIN worker_profile wp ON r.reviewee_id = wp.user_id
      WHERE wp.id = $1
      ORDER BY r.created_at DESC
      LIMIT 3
      `,
      [id],
    );

    response.status(200).json(reviews.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Creates a review for an employer after a completed shift.
 * Only allows reviews if the worker was hired and the job date has passed.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result.
 */
export async function createReview(
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
    const check = await pool.query(
      `
      SELECT a.id FROM application a
      JOIN job j ON a.job_id = j.id
      WHERE a.job_id = $1
      AND a.worker_id = (SELECT id FROM worker_profile WHERE user_id = $2)
      AND a.status = 'hired'
      AND j.job_date < CURRENT_DATE
      `,
      [data.jobId, userId],
    );

    if (check.rows.length === 0) {
      response
        .status(403)
        .json({ message: "Du kan inte betygsätta detta pass" });
      return;
    }

    await pool.query(
      `
      INSERT INTO review (job_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (
        $1,
        (SELECT user_id FROM worker_profile WHERE user_id = $2),
        (SELECT user_id FROM employer_profile WHERE id = $3),
        $4,
        $5
      )
      `,
      [data.jobId, userId, data.revieweeId, data.rating, data.comment],
    );

    response.status(201).json({ message: "Betyget har sparats" });
  } catch (error) {
    console.error(error);
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

    response.status(200).json({ message: "Passet har tagits bort" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches the saved employers for the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of saved employers.
 */
export async function getSavedEmployers(
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
    const savedEmployers = await pool.query(
      `
      SELECT
        ep.id,
        ep.name,
        ep.city,
        ep.description,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM saved_employer se
      JOIN employer_profile ep ON se.employer_id = ep.id
      LEFT JOIN review r ON r.reviewee_id = ep.user_id
      WHERE se.worker_id = (SELECT id FROM worker_profile WHERE user_id = $1)
      GROUP BY ep.id, ep.name, ep.city, ep.description
      `,
      [userId],
    );

    response.status(200).json(savedEmployers.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Saves an employer to the currently logged in worker's saved employer's list.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the unsave operation.
 */
export async function saveEmployer(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { employerId } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      INSERT INTO saved_employer (employer_id, worker_id)
      VALUES (
        $1,
        (SELECT id FROM worker_profile WHERE user_id = $2)
      )
      `,
      [employerId, userId],
    );

    response.status(201).json({ message: "Restaurangen har sparats" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Removes an employer from the currently logged in worker's list of saved employers.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the unsave operation.
 */
export async function unsaveEmployer(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { employerId } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      DELETE FROM saved_employer
      WHERE employer_id = $1
      AND worker_id = (SELECT id FROM worker_profile WHERE user_id = $2)
      `,
      [employerId, userId],
    );

    response.status(200).json({ message: "Restaurangen har tagits bort" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Deletes a pending application of the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the delete operation.
 */
export async function deleteApplication(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { id } = request.params;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });
    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      DELETE FROM application
      WHERE id = $1
      AND worker_id = (SELECT id FROM worker_profile WHERE user_id = $2)
      AND status = 'pending'
      `,
      [id, userId],
    );

    response.status(200).json({ message: "Ansökningen har tagits bort" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Uploads a CV file for the currently logged in worker.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with the updated cv_url and cv_filename.
 */
export async function uploadCV(
  request: Request & { file?: Express.Multer.File },
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const file = request.file;

  if (!file) {
    response.status(400).json({ message: "Ingen fil hittades" });

    return;
  }

  const userId = user.id;

  const filePath = `${userId}/cv.pdf`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, file.buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      response.status(500).json({ message: "Kunde inte ladda upp filen" });
      return;
    }

    const { data: urlData, error: signedUrlError } = await supabase.storage
      .from("cvs")
      .createSignedUrl(filePath, 3600);

    if (signedUrlError || !urlData) {
      response.status(500).json({ message: "Kunde inte hämta URL" });
      return;
    }

    await pool.query(
      `
      UPDATE worker_profile
      SET cv_url = $1, cv_filename = $2
      WHERE user_id = $3
      `,
      [filePath, file.originalname, userId],
    );

    response.status(200).json({
      cv_url: urlData.signedUrl,
      cv_filename: file.originalname,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Generates a signed URL for the currently logged in worker's CV stored in Supabase Storage. The URL is valid for 1 hour.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response containing the signed URL for the worker's CV.
 */
export async function generateSignedCVUrl(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });
    return;
  }

  const userId = user.id;
  const filePath = `${userId}/cv.pdf`;

  try {
    const { data: urlData, error: signedUrlError } = await supabase.storage
      .from("cvs")
      .createSignedUrl(filePath, 3600);

    if (signedUrlError || !urlData) {
      response.status(500).json({ message: "Kunde inte hämta URL" });
      return;
    }

    response.status(200).json({ url: urlData.signedUrl });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}
