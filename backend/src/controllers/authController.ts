import { Request, Response } from "express";
import client from "../db";
import bcrypt from "bcrypt";

export async function registerUser(request: Request, response: Response) {
  const { email, password, role, firstName, lastName, restaurantName } =
    request.body;

  try {
    // Validate email, password and role
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Du måste fylla i alla fält" });
    }

    if (!role || !["worker", "employer"].includes(role)) {
      return response.status(400).json({ message: "Ogiltig roll" });
    }

    if (password.length < 8) {
      return response
        .status(400)
        .json({ message: "Lösenordet måste vara minst 8 tecken" });
    }
    if (!/[A-Z]/.test(password)) {
      return response
        .status(400)
        .json({ message: "Lösenordet måste innehålla minst en stor bokstav" });
    }
    if (!/[a-z]/.test(password)) {
      return response
        .status(400)
        .json({ message: "Lösenordet måste innehålla minst en liten bokstav" });
    }

    if (!/[0-9]/.test(password)) {
      return response
        .status(400)
        .json({ message: "Lösenordet måste innehålla minst en siffra" });
    }

    // Check existing user
    const existingUserResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    const existingUser = existingUserResult.rows[0];

    if (existingUser) {
      return response.status(400).json({
        message: "En användare med den här e-postadressen finns redan",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save in database
    const newUser = await client.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id",
      [email, hashedPassword, role],
    );

    const userId = newUser.rows[0].id;

    // Create user profile
    if (role === "worker") {
      const name = `${firstName} ${lastName}`;

      await client.query(
        "INSERT INTO worker_profile (user_id, name) VALUES ($1, $2)",
        [userId, name],
      );
    } else {
      await client.query(
        "INSERT INTO employer_profile (user_id, name) VALUES ($1, $2)",
        [userId, restaurantName],
      );
    }

    response.status(201).json({ message: "Konto skapat" });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
