import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";
import {
  getAccessibleConversation,
  assertCanSendMessage,
} from "./conversationService.js";

const MAX_MESSAGE_LENGTH = 5000;
const DEFAULT_MESSAGE_LIMIT = 50;

/**
 * Send and save a message in a private conversation.
 */
export async function sendMessage({
  conversationId,
  userId,
  role,
  content,
}) {
  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  if (typeof content !== "string" || !content.trim()) {
    throw new AppError("Message content is required", 400);
  }

  const cleanContent = content.trim();

  if (cleanContent.length > MAX_MESSAGE_LENGTH) {
    throw new AppError(
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      400,
    );
  }

  const conversation = await getAccessibleConversation({
    conversationId,
    userId,
    role,
  });

  await assertCanSendMessage({
    conversation,
    userId,
    role,
  });

  // The sender ID always comes from the authenticated user,
  // never from the request body.
  const message = await prisma.$transaction(async (tx) => {
    const savedMessage = await tx.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: cleanContent,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return savedMessage;
  });

  return message;
}

/**
 * Retrieve the latest messages in a conversation.
 * Only conversation participants can read its history.
 */
export async function getConversationMessages({
  conversationId,
  userId,
  role,
  limit = DEFAULT_MESSAGE_LIMIT,
}) {
  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  const conversation = await getAccessibleConversation({
    conversationId,
    userId,
    role,
  });

  // Keep the limit within a reasonable range.
  const safeLimit = Number.isInteger(Number(limit))
    ? Math.min(Math.max(Number(limit), 1), 100)
    : DEFAULT_MESSAGE_LIMIT;

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: [
      { sentAt: "desc" },
      { id: "desc" },
    ],
    take: safeLimit,
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  // Return messages from oldest to newest for chat interfaces.
  return messages.reverse();
}