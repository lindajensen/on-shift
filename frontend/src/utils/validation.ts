/**
 * Validates email format using a regular expression.
 * @param email - The email to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Error message if invalid, otherwise null
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Lösenordet måste vara minst 8 tecken";
  }

  if (!/[A-Z]/.test(password)) {
    return "Lösenordet måste innehålla minst en stor bokstav";
  }

  if (!/[a-z]/.test(password)) {
    return "Lösenordet måste innehålla minst en liten bokstav";
  }

  if (!/[0-9]/.test(password)) {
    return "Lösenordet måste innehålla minst en siffra";
  }

  return null;
}
