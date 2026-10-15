
import { Router } from "express";
import {
  requireAuth,
  requireRole,
} from "../middleware/authMiddleware.js";
import {
  createRepairRequestDraftController,
} from "../controllers/repairRequestController.js";

const router = Router();

router.post(
  "/drafts",
  requireAuth,
  requireRole("CUSTOMER"),
  createRepairRequestDraftController,
);

export default router;
