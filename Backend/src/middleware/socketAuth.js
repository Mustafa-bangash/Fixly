
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AUTH_COOKIE_NAME } from "../utils/cookieOptions.js";

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;

  for (const item of cookieHeader.split(";")) {
    const separatorIndex = item.indexOf("=");

    if (separatorIndex === -1) continue;

    const key = item.slice(0, separatorIndex).trim();
    const value = item.slice(separatorIndex + 1).trim();

    if (key === name) {
      try {
        return decodeURIComponent(value);
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function socketAuth(socket, next) {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    const token = getCookieValue(cookieHeader, AUTH_COOKIE_NAME);

    console.log("Socket authentication attempt received");
    console.log("Authentication cookie present:", Boolean(token));

    if (!token || !process.env.JWT_SECRET) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      typeof decoded === "string" ||
      !decoded.id ||
      !decoded.role
    ) {
      return next(new Error("Invalid authentication token"));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        isVerified: true,
      },
    });

    if (
      !user ||
      !user.isVerified ||
      user.role !== decoded.role
    ) {
      return next(new Error("Invalid authentication token"));
    }

    socket.data.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    console.log("Socket authentication failed:", error.message);
    return next(new Error("Authentication required"));
    }
}
