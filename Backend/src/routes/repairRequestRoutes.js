
import { Router } from "express";

import {
  requireAuth,
  requireRole,
} from "../middleware/authMiddleware.js";

import {
  createRepairRequestDraftController,
  getServiceCategoriesController,
  submitRepairRequestController,
} from "../controllers/repairRequestController.js";

const router = Router();

router.post(
  "/drafts",
  requireAuth,
  requireRole("CUSTOMER"),
  createRepairRequestDraftController,
);

router.post(
  "/:requestId/submit",
  requireAuth,
  requireRole("CUSTOMER"),
  submitRepairRequestController,
);

router.get(
  "/categories",
  getServiceCategoriesController,
);

export default router;
