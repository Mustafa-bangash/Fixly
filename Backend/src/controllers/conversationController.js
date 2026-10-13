import {
  createOrGetConversation,
  listMyConversations,
  getAccessibleConversation,
} from "../services/conversationService.js";
import { AppError } from "../utils/apperror.js";

function handleError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  console.error("Conversation controller error:", error);

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
}

/**
 * POST /api/conversations
 * Create or retrieve a conversation for a repair request.
 */
export async function openConversation(req, res) {
  try {
    const { requestId, providerId } = req.body;

    const conversation = await createOrGetConversation({
      requestId,
      providerId,
      userId: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json({
      message: "Conversation retrieved successfully",
      conversation,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
/**
 * GET /api/conversations
 * List conversations belonging to the logged-in user.
 */
export async function getMyConversations(req, res) {
  try {
    const conversations = await listMyConversations({
      userId: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json({
      conversations,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /api/conversations/:conversationId
 * Retrieve a conversation after checking participant access.
 */
export async function getConversationById(req, res) {
  try {
    const conversation = await getAccessibleConversation({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json({
      conversation,
    });
  } catch (error) {
    return handleError(res, error);
  }
}