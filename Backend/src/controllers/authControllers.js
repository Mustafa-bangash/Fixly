import {signupCustomer,loginUser, verifyCustomerEmail, resendCustomerVerificationOtp} from "../services/authService.js";
import { validateSignupInput } from "../utils/validators.js";
import { AUTH_COOKIE_NAME, authCookieOptions } from "../utils/cookieOptions.js";
import { AppError } from "../utils/apperror.js";

function handleError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.status).json({ message: error.message });
  }
  // Two signups at the same moment can both pass the duplicate check; the database still blocks the second
  if (error.code === "P2002") {
    return res.status(409).json({ message: "Email or phone number is already registered" });
  }
  console.error(error);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
}

export async function customerSignup(req, res) {
  try {
    const errors = validateSignupInput(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Invalid input", errors });
    }
    const user = await signupCustomer(req.body);
    return res.status(201).json({
      message: "Account created. Please verify your account to continue.",
      user,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function customerLogin(req, res) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Email or phone, and password are required" });
    }
    const { token, tokenExpiresAt, user } = await loginUser({
      identifier,
      password,
      expectedRole: "CUSTOMER",
    });

    res.cookie(AUTH_COOKIE_NAME, token, {
      ...authCookieOptions(),
      maxAge: tokenExpiresAt - Date.now(),
    });

    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error);
  }
}


export async function customerVerifyEmail(req, res) {
  try {
    const { email, otp } = req.body ?? {};

    const result = await verifyCustomerEmail({
      email,
      otp,
    });

    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}


export async function customerResendOtp(req, res) {
  try {
    const { email } = req.body ?? {};

    const result = await resendCustomerVerificationOtp(email);

    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}



export function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions());
  return res.status(200).json({ message: "Logged out" });
}
