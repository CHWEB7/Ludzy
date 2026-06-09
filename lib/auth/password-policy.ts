const MIN_LENGTH = 12;

export type PasswordValidation = {
  ok: boolean;
  errors: string[];
};

/** Enforces strong passwords for admin accounts (12+ chars, mixed case, number, symbol). */
export function validateStrongPassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < MIN_LENGTH) {
    errors.push(`At least ${MIN_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("At least one special character");

  return { ok: errors.length === 0, errors };
}

export const PASSWORD_REQUIREMENTS =
  "Minimum 12 characters with uppercase, lowercase, a number, and a special character.";
