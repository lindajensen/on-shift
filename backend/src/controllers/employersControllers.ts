import { Request, Response } from "express";
import pool from "../db";

/**
 * Fetches all workers.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of all workers.
 */
export async function getAllWorkers(request: Request, response: Response) {
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  try {
    const allWorkers = await pool.query(
      `
      SELECT
        wp.id,
        wp.name,
        wp.is_available,
        wp.city AS location,
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM worker_profile wp
      JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      GROUP BY wp.id, wp.name, wp.is_available, wp.city
      ORDER BY wp.name ASC
      `,
    );

    response.status(200).json(allWorkers.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

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

export async function getJobDetails(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;
  const user = request.user;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.userId;

  try {
    const jobDetails = await pool.query(
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
        j.status,
        ep.address AS location,
        JSON_AGG(
          json_build_object(
            'id', a.id,
            'worker_name', wp.name,
            'role', (SELECT role FROM worker_role WHERE worker_id = wp.id LIMIT 1),
            'experience_level', (SELECT experience_level FROM worker_role WHERE worker_id = wp.id LIMIT 1),
            'status', a.status,
            'rating', (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM review r WHERE r.reviewee_id = wp.user_id)
          )
        ) FILTER (WHERE a.id IS NOT NULL) AS applications
      FROM job j
      LEFT JOIN application a ON a.job_id = j.id
      LEFT JOIN worker_profile wp ON a.worker_id = wp.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE j.id = $1 AND ep.user_id = $2
      GROUP BY j.id, ep.address
      `,
      [id, userId],
    );

    response.status(200).json(jobDetails.rows[0]);
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
    demands,
    isUrgent,
    requires_experience,
  } = request.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO job (employer_id, role, description, compensation, job_date, start_time, end_time, available_slots, demands, is_urgent, requires_experience)
      VALUES (
        (SELECT id FROM employer_profile WHERE user_id = $1),
        $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
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
        demands,
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
 * Updates an existing job listing if it belongs to the currently logged in restaurant.
 * @param request - The request object
 * @param response - The resposne obkect
 * @returns A JSON object of the updated job listing, or an error message if something went wrong.
 */
export async function updateJobListing(
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

  const {
    role,
    date,
    startTime,
    endTime,
    compensation,
    availableSlots,
    description,
    demands,
    isUrgent,
    requires_experience,
  } = request.body;

  try {
    const result = await pool.query(
      `
      UPDATE job
      SET
        role = $2,
        description = $3,
        compensation = $4,
        job_date = $5,
        start_time = $6,
        end_time = $7,
        available_slots = $8,
        is_urgent = $9,
        requires_experience = $10,
        demands = $11
      WHERE id = $1
      AND employer_id = (SELECT id FROM employer_profile WHERE user_id = $12)
      RETURNING *
      `,
      [
        id,
        role,
        description,
        compensation,
        date,
        startTime,
        endTime,
        availableSlots,
        isUrgent,
        requires_experience,
        demands,
        userId,
      ],
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Closes a job listing if it belongs to the currently logged in restaurant by setting its status to "closed".
 * @param request - The request object
 * @param response - The response object
 * @returns A success message if the listing was closed, or an error message if something went wrong.
 */
export async function closeJobListing(
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
      `
      UPDATE job SET status = 'closed' WHERE id = $1 AND employer_id = (SELECT id FROM employer_profile WHERE user_id = $2)
      `,
      [id, userId],
    );

    response.status(200).json({ message: "Annonsen har avslutats" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Reopens a job listing if it belongs to the currently logged in restaurant by setting its status to "active".
 * @param request - The request object
 * @param response - The response object
 * @returns A success message if the listing was repopened, or an error message if something went wrong.
 */
export async function reopenJobListing(
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
      `
      UPDATE job SET status = 'active' WHERE id = $1 AND employer_id = (SELECT id FROM employer_profile WHERE user_id = $2)
      `,
      [id, userId],
    );

    response.status(200).json({ message: "Annonsen har återaktiverats" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
