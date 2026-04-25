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
