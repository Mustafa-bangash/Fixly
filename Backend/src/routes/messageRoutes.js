import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

// All message routes require authentication.
router.use(requireAuth);

// Send a message.
router.post("/", createMessage);

// Retrieve conversation messages.
router.get("/", getMessages);

export default router;