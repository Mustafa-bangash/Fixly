import {
  sendMessage,
  getConversationMessages,
} from "../services/messageService.js";
import { AppError } from "../utils/apperror.js";

function handleError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  console.error("Message controller error:", error);

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
}

/**
 * POST /api/conversations/:conversationId/messages
 * Send a message in a conversation.
 */
export async function createMessage(req, res) {
  try {
    const message = await sendMessage({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      role: req.user.role,
      content: req.body.content,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /api/conversations/:conversationId/messages
 * Retrieve message history.
 */
export async function getMessages(req, res) {
  try {
    const messages = await getConversationMessages({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      role: req.user.role,
      limit: req.query.limit,
    });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    return handleError(res, error);
  }
}