import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";

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

export async function signupCustomer({ fullName, email, phone, password }) {
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
      role: "CUSTOMER",
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      customerProfile: { create: {} },
    },
    select: publicUserFields,
  });

  // TODO (Epic 2, Story 1): call the OTP service here to send the verification code
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