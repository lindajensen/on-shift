import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "Åtkomst nekad" });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({ message: "Ogiltig token" });
  }
}
