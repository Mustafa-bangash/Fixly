import api from './axiosInstance.js';

/**
 * Centralized Authentication API service for Fixly
 * Both Customer and Provider share the exact same 4 authentication operations.
 * The 'role' parameter ('customer' or 'provider') determines the API route.
 */

/**
 * 1. Sign Up (Customer or Provider)
 * @param {'customer' | 'provider'} role
 * @param {{ fullName: string, email: string, phone: string, password: string }} data
 */
export async function registerUser(role, data) {
  const response = await api.post(`/auth/${role}/signup`, {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    password: data.password,
  });
  return response.data;
}

/**
 * 2. Sign In / Login (Customer or Provider)
 * @param {'customer' | 'provider'} role
 * @param {{ identifier: string, password: string }} data
 */
export async function loginUser(role, data) {
  const response = await api.post(`/auth/${role}/login`, {
    identifier: data.identifier.trim(),
    password: data.password,
  });
  return response.data;
}

/**
 * 3. Verify Email with 6-digit OTP (Customer or Provider)
 * @param {'customer' | 'provider'} role
 * @param {{ email: string, otp: string }} data
 */
export async function verifyUserEmail(role, data) {
  const response = await api.post(`/auth/${role}/verify-email`, {
    email: data.email.trim().toLowerCase(),
    otp: data.otp.trim(),
  });
  return response.data;
}

/**
 * 4. Resend OTP Verification Code (Customer or Provider)
 * @param {'customer' | 'provider'} role
 * @param {string} email
 */
export async function resendUserOtp(role, email) {
  const response = await api.post(`/auth/${role}/resend-otp`, {
    email: email.trim().toLowerCase(),
  });
  return response.data;
}

/**
 * Logout (Clears auth cookie)
 */
export async function logoutUser() {
  const response = await api.post('/auth/logout');
  return response.data;
}



/**
 * Restore the currently authenticated user from the JWT cookie.
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
