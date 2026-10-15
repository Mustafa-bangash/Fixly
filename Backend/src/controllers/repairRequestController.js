
import {
  createRepairRequestDraft,
} from "../services/repairRequestService.js";
import { AppError } from "../utils/apperror.js";

function handleError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  console.error("Repair request controller error:", error);

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
}

/**
 * POST /api/repair-requests/drafts
 * Create a repair request draft for the logged-in customer.
 */
export async function createRepairRequestDraftController(
  req,
  res,
) {
  try {
    const {
      categoryId,
      description,
      isComplexJob,
      isEmergency,
    } = req.body;

    const draft = await createRepairRequestDraft({
      userId: req.user.id,
      categoryId,
      description,
      isComplexJob,
      isEmergency,
    });

    return res.status(201).json({
      message: "Repair request draft created successfully",
      draft,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
