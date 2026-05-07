/**
 * Validates email format using a regular expression.
 * @param email - The email to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates phone number format using a regular expression.
 * @param phone - The phone number to validate
 * @returns True if valid phone number format
 */
export function validatePhone(phone: string): boolean {
  return /^[0-9\s\-+()]{7,15}$/.test(phone);
}

/**
 * Validates postal code format using a regular expression.
 * @param postalCode - The postal code to validate
 * @returns True if valid postal code format
 */
export function validatePostalCode(postalCode: string): boolean {
  return /^\d{3}\s\d{2}$/.test(postalCode);
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
