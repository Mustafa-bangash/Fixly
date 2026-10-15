
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma.js";

async function seedAdmin() {
  // 1. Read credentials from environment variables.
  const fullName = process.env.ADMIN_FULL_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const phone = process.env.ADMIN_PHONE?.trim();
  const password = process.env.ADMIN_PASSWORD;

  // 2. Make sure all required values exist.
  if (!fullName || !email || !phone || !password) {
    throw new Error("Missing admin environment variables");
  }

  // 3. Check whether this email is already registered.
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.role !== "ADMIN") {
      throw new Error("Email already belongs to another role");
    }

    console.log("Admin already exists");
    return;
  }

  // 4. Hash the password before storing it.
  const passwordHash = await bcrypt.hash(password, 10);

  // 5. Create the admin account.
  await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Admin account created successfully");
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
