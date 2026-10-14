import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";
import { createEmailVerificationOtp,verifyEmailOtp } from "./otpService.js";

import { sendVerificationEmail } from "./emailService.js";

const SALT_ROUNDS = 10;

const publicUserFields = {
  id: true,
  role: true,
  fullName: true,
  email: true,
  phone: true,
  isVerified: true,
  profilePhotoUrl: true,
  createdAt: true,
};

export async function signupUser({ fullName, email, phone, password },role) {

  if (!["CUSTOMER", "PROVIDER"].includes(role)) {
  throw new AppError("Invalid signup role", 400);
}

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: cleanEmail }, { phone: cleanPhone }] },
    select: { email: true },
  });
  if (existing) {
    const field = existing.email === cleanEmail ? "email" : "phone number";
    throw new AppError(`This ${field} is already registered`, 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Creates the User and its CustomerProfile together, so one can't exist without the other
  
const user = await prisma.user.create({
  data: {
    role,
    fullName: fullName.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    passwordHash,

    ...(role === "CUSTOMER"
      ? { customerProfile: { create: {} } }
      : { providerProfile: { create: {} } }),
  },
  select: publicUserFields,
});

  // TODO (Epic 2, Story 1): call the OTP service here to send the verification code

  // Generate and store the customer's verification OTP.
  const otp = await createEmailVerificationOtp(user.id);

  // Send the OTP to the customer's email using Brevo.
  try {
    await sendVerificationEmail(user.email, otp);
  } catch (error) {
    // The customer account and OTP already exist in PostgreSQL.
    // Keep the account so the customer can request another OTP later.
    console.error(
      "Failed to send signup verification email:",
      error.message
    );

    throw new AppError(
      "Your account was created, but we couldn't send the verification email. Please request a new code.",
      503
    );
  }

  

  return user;
}

export async function loginUser({ identifier, password, expectedRole }) {
  const value = identifier.trim();

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: value.toLowerCase() }, { phone: value }] },
  });

  const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;

  // One generic message for every failure, so attackers can't tell which part was wrong
  if (!user || !passwordOk || user.role !== expectedRole) {
    throw new AppError("Invalid credentials", 401);
  }

  // Checked only after the password is correct, so we don't reveal which accounts exist
  if (!user.isVerified) {
    throw new AppError("Please verify your account before logging in", 403);
  }

   const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // exp is in seconds; we need milliseconds to set the cookie lifetime
  const { exp } = jwt.decode(token);

  const { passwordHash, ...safeUser } = user;
  return { token, tokenExpiresAt: exp * 1000, user: safeUser };
}

export async function verifyUserEmail({ email, otp }, expectedRole) {
  // 1. Validate the email
  if (typeof email !== "string" || !email.trim()) {
    throw new AppError("Email is required", 400);
  }

  const cleanEmail = email.trim().toLowerCase();

  // 2. Find the customer
  const user = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
    select: {
      id: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user || user.role !== expectedRole) {
    throw new AppError("Invalid email or verification code", 400);
  }

  // 3. Check whether already verified
  if (user.isVerified) {
    throw new AppError("Email is already verified", 409);
  }

  // 4. Verify the OTP using our existing service
  return verifyEmailOtp(user.id, otp);
}


export async function resendUserVerificationOtp(email, expectedRole) {
  // 1. Validate email format
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw new AppError("Valid email is required", 400);
  }

  const cleanEmail = email.trim().toLowerCase();

  // 2. Find the customer
  const user = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  // 3. Return a generic response for unknown or verified accounts.
  // Avoid revealing which email addresses have accounts.
  if (!user || user.role !== expectedRole || user.isVerified) {
    return {
      message:
        "If this email belongs to an unverified account, a verification code will be sent if eligible.",
    };
  }

  // 4. Generate and store a new OTP.
  // Our OTP service enforces cooldown and hourly limits.
  const otp = await createEmailVerificationOtp(user.id);

  // 5. Send the new OTP through Brevo.
  try {
    await sendVerificationEmail(user.email, otp);
  } catch (error) {
    console.error(
      "Failed to resend verification email:",
      error.message
    );

    throw new AppError(
      "Unable to send verification email. Please try again later.",
      503
    );
  }

  return {
    message:
      "If this email belongs to an unverified account, a verification code will be sent if eligible.",
  };
}
