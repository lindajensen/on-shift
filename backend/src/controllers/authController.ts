import { Request, Response } from "express";
import client from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//! Måste lägga till return types och JSDocs

/**
 * Reegisters a new user. Validates the input, checks for existing users, hashes the password and saves the user in the database. Also creates a profile based on the user's role.
 * @param request
 * @param response
 * @returns A JSON response with a message indicating the result of the registration process.
 */
export async function registerUser(
  request: Request,
  response: Response,
): Promise<void> {
  const { email, password, role, firstName, lastName, restaurantName } =
    request.body;

  try {
    // Validate email, password and role
    if (!email || !password) {
      response.status(400).json({ message: "Du måste fylla i alla fält" });
      return;
    }

    if (!role || !["worker", "employer"].includes(role)) {
      response.status(400).json({ message: "Ogiltig roll" });
      return;
    }

    if (password.length < 8) {
      response
        .status(400)
        .json({ message: "Lösenordet måste vara minst 8 tecken" });

      return;
    }
    if (!/[A-Z]/.test(password)) {
      response
        .status(400)
        .json({ message: "Lösenordet måste innehålla minst en stor bokstav" });
      return;
    }

    if (!/[a-z]/.test(password)) {
      response
        .status(400)
        .json({ message: "Lösenordet måste innehålla minst en liten bokstav" });
      return;
    }

    if (!/[0-9]/.test(password)) {
      response
        .status(400)
        .json({ message: "Lösenordet måste innehålla minst en siffra" });
      return;
    }

    // Check existing user
    const existingUserResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    const existingUser = existingUserResult.rows[0];

    if (existingUser) {
      response.status(400).json({
        message: "En användare med den här e-postadressen finns redan",
      });

      return;
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

/**
 * Logs in a user. Validates the input, checks for the user in the database, compares the password and generates a JWT if the credentials are correct.
 * @param request
 * @param response
 * @returns A JSON response with a message indicating the result of the login process, a JWT token if the login was successful and the user's role.
 */
export async function loginUser(
  request: Request,
  response: Response,
): Promise<void> {
  const { email, password } = request.body;

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      response.status(400).json({ message: "Fel e-postadress eller lösenord" });

      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      response.status(400).json({ message: "Fel e-postadress eller lösenord" });

      return;
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "1h" },
    );

    response.status(200).json({
      message: "Inloggad",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    response.status(500).json({ message: "Något gick fel" });
  }
}
