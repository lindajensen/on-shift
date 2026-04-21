/**
 * Validates email format using a regular expression.
 * @param email - The email to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
