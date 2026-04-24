/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import client from "../db";

export async function toggleAvailability(request: Request, response: Response) {
  const user = request.user;
  const { isAvailable } = request.body;

  if (!user) {
    return response.status(401).json({ message: "Åtkomst nekad" });
  }

  const userId = user.userId;

  await client.query(
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
    const profile = await client.query(
      "SELECT * FROM worker_profile WHERE user_id = $1",
      [userId],
    );

    response.status(200).json(profile.rows[0]);
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
