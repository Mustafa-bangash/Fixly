
import {
  createRepairRequestDraft,
  getServiceCategories,
  submitRepairRequest,
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
 */
export async function createRepairRequestDraftController(req, res) {
  try {
    const {
      categoryId,
      description,
      isComplexJob,
      isEmergency,
      emergencyType,
      serviceArea,
      detailedAddress,
    } = req.body;

    const draft = await createRepairRequestDraft({
      userId: req.user.id,
      categoryId,
      description,
      isComplexJob,
      isEmergency,
      emergencyType,
      serviceArea,
      detailedAddress,
    });

    return res.status(201).json({
      message: "Repair request draft created successfully",
      draft,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * POST /api/repair-requests/:requestId/submit
 */
export async function submitRepairRequestController(req, res) {
  try {
    const submittedRequest = await submitRepairRequest({
      userId: req.user.id,
      requestId: req.params.requestId,
    });

    return res.status(200).json({
      message: submittedRequest.alreadySubmitted
        ? "Repair request was already submitted"
        : "Repair request submitted successfully",
      alreadySubmitted: submittedRequest.alreadySubmitted,
      request: {
        id: submittedRequest.id,
        categoryId: submittedRequest.categoryId,
        description: submittedRequest.description,
        isComplexJob: submittedRequest.isComplexJob,
        isEmergency: submittedRequest.isEmergency,
        emergencyType: submittedRequest.emergencyType,
        status: submittedRequest.status,
        serviceArea: submittedRequest.serviceArea,
        detailedAddress: submittedRequest.detailedAddress,
        submittedAt: submittedRequest.submittedAt,
        biddingDurationMinutes:
          submittedRequest.biddingDurationMinutes,
        biddingDeadline: submittedRequest.biddingDeadline,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * GET /api/repair-requests/categories
 */
export async function getServiceCategoriesController(req, res) {
  try {
    const categories = await getServiceCategories();

    return res.status(200).json({ categories });
  } catch (error) {
    return handleError(res, error);
  }
}
