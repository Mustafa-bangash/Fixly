import { Router } from "express";
import messageRoutes from "./messageRoutes.js";
import {
  openConversation,
  getMyConversations,
  getConversationById,
} from "../controllers/conversationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getMyConversations);
router.post("/", openConversation);
router.use("/:conversationId/messages", messageRoutes);
router.get("/:conversationId", getConversationById);

export default router;