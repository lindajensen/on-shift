/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import pool from "../db";

export async function toggleAvailability(request: Request, response: Response) {
  const user = request.user;
  const { isAvailable } = request.body;

  if (!user) {
    return response.status(401).json({ message: "Åtkomst nekad" });
  }

  const userId = user.userId;

  await pool.query(
    "UPDATE worker_profile SET is_available = $1 WHERE user_id = $2",
    [isAvailable, userId],
  );

  response.status(200).json({ message: "Tillgänglighet uppdaterad" });
}

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

export async function getWorkerApplications(
  request: Request,
  response: Response,
) {
  const user = request.user;

  if (!user) {
    return response.status(401).json({ message: "Åtkomst nekad" });
  }

  const userId = user.userId;

  try {
    const applications = await pool.query(
      `
      SELECT
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
