import { Request, Response } from "express";
import pool from "../db";

/**
 * Fetches the profile of an employer by their employer profile ID.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the employer's profile information.
 */
export async function getEmployerProfileById(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;

  try {
    const employerProfile = await pool.query(
      `
      SELECT
       ep.id,
       ep.user_id,
       ep.name,
       ep.email,
       ep.phone,
       ep.street,
       ep.postal_code,
       ep.city,
       ep.description,
      ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM employer_profile ep
      LEFT JOIN review r ON r.reviewee_id = ep.user_id
      WHERE ep.id = $1
      GROUP BY ep.id, ep.user_id, ep.name, ep.email, ep.phone, ep.street, ep.postal_code, ep.city, ep.description
      `,
      [id],
    );

    response.status(200).json(employerProfile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches the profile of the currently logged in employer.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the employer's profile information.
 */
export async function getEmployerProfileByUserId(
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
    const employerProfile = await pool.query(
      `
      SELECT
        ep.id,
        ep.user_id,
        ep.name,
        ep.email,
        ep.phone,
        ep.street,
        ep.postal_code,
        ep.city,
        ep.description,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM employer_profile ep
      LEFT JOIN review r ON r.reviewee_id = ep.user_id
      WHERE ep.user_id = $1
      GROUP BY ep.id, ep.user_id, ep.name, ep.email, ep.phone, ep.street, ep.postal_code, ep.city, ep.description
      `,
      [userId],
    );

    response.status(200).json(employerProfile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Updates the contact information of the currently logged in employer.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the updated employer contact information.
 */
export async function updateEmployerContact(
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
      UPDATE employer_profile
      SET
        name = $1,
        email = $2,
        phone = $3,
        street = $4,
        postal_code = $5,
        city = $6
      WHERE user_id = $7
      RETURNING *
      `,
      [
        data.name || null,
        data.email || null,
        data.phone || null,
        data.street || null,
        data.postal_code || null,
        data.city || null,
        userId,
      ],
    );

    response.status(200).json(updatedContact.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Updates the description of the currently logged in employer.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON object containing the updated employer's description.
 */
export async function updateEmployerDescription(
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
    const updatedDescription = await pool.query(
      `
      UPDATE employer_profile
      SET
        description = $1
      WHERE user_id = $2
      RETURNING *
      `,
      [data.description || null, userId],
    );

    response.status(200).json(updatedDescription.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}

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
        JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) AS availability,
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM worker_profile wp
      JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      LEFT JOIN availability a ON a.worker_id = wp.id
      WHERE wp.is_available = true
      GROUP BY wp.id, wp.name, wp.is_available, wp.city
      ORDER BY wp.name ASC
      `,
    );

    response.status(200).json(allWorkers.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Fetches 3 random workers to show on the landingpage.
 * @param _request - The request object (not used).
 * @param response - The response object.
 * @returns A JSON array of 3 random workers with their roles and average rating.
 */
export async function getRandomWorkers(
  _request: Request,
  response: Response,
): Promise<void> {
  try {
    const randomWorkers = await pool.query(
      `
     SELECT
      wp.id,
      wp.name,
      wp.is_available,
      wp.city,
      JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
      JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) AS availability,
      ROUND(AVG(r.rating)::numeric, 1) AS rating
    FROM worker_profile wp
    JOIN worker_role wr ON wr.worker_id = wp.id
    LEFT JOIN review r ON r.reviewee_id = wp.user_id
    LEFT JOIN availability a ON a.worker_id = wp.id
    WHERE wp.is_available = true
    GROUP BY wp.id, wp.name, wp.is_available, wp.city
    ORDER BY RANDOM()
    LIMIT 3
      `,
    );

    response.status(200).json(randomWorkers.rows);
  } catch (error) {
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

  const userId = user.id;

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

  const userId = user.id;

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
        CASE
          WHEN ep.street IS NOT NULL AND ep.postal_code IS NOT NULL AND ep.city IS NOT NULL
          THEN CONCAT(ep.street, ', ', ep.postal_code, ' ', ep.city)
          WHEN ep.city IS NOT NULL THEN ep.city
          ELSE NULL
        END AS location,
        JSON_AGG(
          json_build_object(
            'id', a.id,
            'worker_id', wp.id,
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
      GROUP BY j.id, ep.street, ep.postal_code, ep.city
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

  const userId = user.id;

  try {
    const applications = await pool.query(
      `
     SELECT
        a.id,
        a.status,
        a.job_id,
        j.role,
        j.job_date,
        j.start_time,
        j.end_time,
        wp.id AS worker_id,
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

  const userId = user.id;

  try {
    const savedWorkers = await pool.query(
      `
      SELECT
        wp.id,
        wp.name,
        wp.is_available,
        wp.city AS location,
        sw.created_at AS saved_at,
        JSON_AGG(DISTINCT jsonb_build_object('role', wr.role, 'experience_level', wr.experience_level)) AS roles,
        JSON_AGG(DISTINCT jsonb_build_object('day_of_week', a.day_of_week, 'start_time', a.start_time, 'end_time', a.end_time)) AS availability,
        ROUND(AVG(r.rating)::numeric, 1) AS rating
      FROM saved_worker sw
      JOIN worker_profile wp ON sw.worker_id = wp.id
      JOIN worker_role wr ON wr.worker_id = wp.id
      LEFT JOIN review r ON r.reviewee_id = wp.user_id
      LEFT JOIN availability a ON a.worker_id = wp.id
      JOIN employer_profile ep ON sw.employer_id = ep.id
      WHERE ep.user_id = $1
      GROUP BY wp.id, wp.name, wp.is_available, wp.city, sw.created_at
      `,
      [userId],
    );

    response.status(200).json(savedWorkers.rows);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Saves a worker to the currently logged in restaurant's saved workers list.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the unsave operation.
 */
export async function saveWorker(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { workerId } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      INSERT INTO saved_worker (employer_id, worker_id)
      VALUES (
        (SELECT id FROM employer_profile WHERE user_id = $1),
        $2
      )
      `,
      [userId, workerId],
    );

    response.status(201).json({ message: "Personalen har sparats" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}

/**
 * Removes a worker from the currently logged in restaurant's list of saved workers.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON response with a message indicating the result of the unsave operation.
 */
export async function unsaveWorker(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { workerId } = request.body;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });

    return;
  }

  const userId = user.id;

  try {
    await pool.query(
      `
      DELETE FROM saved_worker
      WHERE worker_id = $1
      AND employer_id = (SELECT id FROM employer_profile WHERE user_id = $2)
      `,
      [workerId, userId],
    );

    response.status(200).json({ message: "Personalen har tagits bort" });
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

  const userId = user.id;

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
 * Fetches the 3 most recent reviews of a restaurant by the restaurant's employer profile ID.
 * @param request - The request object.
 * @param response - The response object.
 * @returns A JSON array of the restaurant's reviews.
 */
export async function getEmployerReviewsById(
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
        wp.name AS reviewer_name,
        j.role,
        j.job_date
      FROM review r
      JOIN worker_profile wp ON r.reviewer_id = wp.user_id
      JOIN job j ON r.job_id = j.id
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE ep.id = $1
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

  const userId = user.id;

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

  const userId = user.id;

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

  const userId = user.id;

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

  const userId = user.id;

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

/**
 * Fetches all active job listings for a given employer.
 * @param request - The request object
 * @param response - The response object
 * @returns A JSON array of active job listings for the specified employer, or an error message if something went wrong.
 */
export async function getPublicJobListings(
  request: Request,
  response: Response,
): Promise<void> {
  const user = request.user;
  const { id: employerId } = request.params;

  if (!user) {
    response.status(401).json({ message: "Åtkomst nekad" });
    return;
  }

  try {
    const jobListings = await pool.query(
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
        ep.name AS restaurant_name
      FROM job j
      JOIN employer_profile ep ON j.employer_id = ep.id
      WHERE j.employer_id = $1
      AND j.status = 'active'
      ORDER BY j.job_date ASC
      `,
      [employerId],
    );

    response.status(200).json(jobListings.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Något gick fel" });
  }
}
