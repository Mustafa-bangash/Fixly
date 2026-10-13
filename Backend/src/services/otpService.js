
import { randomInt } from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";

const OTP_EXPIRY_MINUTES = 5;
const SALT_ROUNDS = 10;

const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_REQUESTS_PER_HOUR = 5;
const OTP_REQUEST_WINDOW_MS = 60 * 60 * 1000;

/**
 * Generate a secure six-digit OTP.
 */
function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

/**
 * Generate, hash, and store an email verification OTP.
 */


export async function createEmailVerificationOtp(userId) {
  // Generate and hash the OTP before starting the transaction.
  const otp = generateOtp();
  const codeHash = await bcrypt.hash(otp, SALT_ROUNDS);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.$transaction(async (tx) => {
    // Lock this user's row until the transaction completes.
    // Concurrent OTP requests for the same user must wait.
    const lockedUsers = await tx.$queryRaw`
      SELECT id FROM "User"
      WHERE id = ${userId}
      FOR UPDATE
    `;

    if (lockedUsers.length === 0) {
      throw new AppError("User not found", 404);
    }

    // Check the most recent OTP while holding the lock.
    const latestOtp = await tx.otpCode.findFirst({
      where: {
        userId,
        purpose: "ACCOUNT_VERIFICATION",
        channel: "EMAIL",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestOtp) {
      const secondsSinceLastOtp = Math.floor(
        (Date.now() - latestOtp.createdAt.getTime()) / 1000
      );

      if (secondsSinceLastOtp < OTP_RESEND_COOLDOWN_SECONDS) {
        const remainingSeconds =
          OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastOtp;

        throw new AppError(
          `Please wait ${remainingSeconds} seconds before requesting another code.`,
          429
        );
      }
    }

    // Check the hourly request limit.
    const oneHourAgo = new Date(
      Date.now() - OTP_REQUEST_WINDOW_MS
    );

    const recentOtpCount = await tx.otpCode.count({
      where: {
        userId,
        purpose: "ACCOUNT_VERIFICATION",
        channel: "EMAIL",
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentOtpCount >= MAX_OTP_REQUESTS_PER_HOUR) {
      throw new AppError(
        "Too many verification code requests. Please try again later.",
        429
      );
    }

    // Invalidate previous OTPs.
    await tx.otpCode.updateMany({
      where: {
        userId,
        purpose: "ACCOUNT_VERIFICATION",
        channel: "EMAIL",
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // Store the new OTP.
    await tx.otpCode.create({
      data: {
        userId,
        codeHash,
        channel: "EMAIL",
        purpose: "ACCOUNT_VERIFICATION",
        expiresAt,
        attemptCount: 0,
      },
    });
  });

  return otp;
}


/**
 * Verify a customer's email OTP.
 */



export async function verifyEmailOtp(userId, submittedOtp) {
  // 1. Validate OTP format
  if (
    typeof submittedOtp !== "string" ||
    !/^\d{6}$/.test(submittedOtp)
  ) {
    throw new AppError("Invalid verification code", 400);
  }

  // 2. Find the latest unused OTP
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId,
      channel: "EMAIL",
      purpose: "ACCOUNT_VERIFICATION",
      isUsed: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new AppError(
      "No active verification code found",
      400
    );
  }

  // 3. Check whether OTP is expired
  if (otpRecord.expiresAt <= new Date()) {
    throw new AppError(
      "Verification code has expired",
      400
    );
  }

  // 4. Reject OTPs that reached the attempt limit
  if (otpRecord.attemptCount >= MAX_OTP_ATTEMPTS) {
    throw new AppError(
      "Too many incorrect attempts. Request a new code.",
      429
    );
  }

  // 5. Compare OTP with the stored hash
  const isValid = await bcrypt.compare(
    submittedOtp,
    otpRecord.codeHash
  );

  if (!isValid) {
    // Increment the attempt counter atomically.
    const result = await prisma.otpCode.updateMany({
      where: {
        id: otpRecord.id,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
        attemptCount: {
          lt: MAX_OTP_ATTEMPTS,
        },
      },
      data: {
        attemptCount: {
          increment: 1,
        },
      },
    });

    if (result.count !== 1) {
      throw new AppError(
        "Verification code is no longer valid",
        400
      );
    }

    throw new AppError(
      "Invalid verification code",
      400
    );
  }

  // 6. Consume OTP and verify customer in a transaction
  await prisma.$transaction(async (tx) => {
    const result = await tx.otpCode.updateMany({
      where: {
        id: otpRecord.id,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
        attemptCount: {
          lt: MAX_OTP_ATTEMPTS,
        },
      },
      data: {
        isUsed: true,
      },
    });

    if (result.count !== 1) {
      throw new AppError(
        "Verification code is no longer valid",
        400
      );
    }

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  });

  return {
    message: "Email verified successfully",
  };
}

