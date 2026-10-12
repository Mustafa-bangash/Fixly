const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/; // TODO: confirm phone format with the team
const MIN_PASSWORD_LENGTH = 8; // TODO: confirm password rule with the team

export function validateSignupInput({ fullName, email, phone, password }) {
  const errors = [];
  if (!fullName || fullName.trim().length < 2) errors.push("Full name is required");
  if (!email || !EMAIL_REGEX.test(email.trim())) errors.push("A valid email is required");
  if (!phone || !PHONE_REGEX.test(phone.trim())) errors.push("A valid phone number is required");
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return errors;
}