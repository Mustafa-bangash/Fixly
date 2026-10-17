
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";

const ALLOWED_SERVICE_AREAS = ["Islamabad", "Rawalpindi"];

const ALLOWED_EMERGENCY_TYPES = [
  "GAS_LEAK",
  "ELECTRICAL_SPARK",
  "FLOODING",
];

const NORMAL_BIDDING_DURATION_MINUTES = 48 * 60;

function getEmergencyBiddingDuration() {
  const configuredDuration = Number(
    process.env.EMERGENCY_BIDDING_DURATION_MINUTES ?? 15,
  );

  if (
    !Number.isInteger(configuredDuration) ||
    configuredDuration < 15 ||
    configuredDuration > 30
  ) {
    throw new AppError(
      "Emergency bidding duration must be configured between 15 and 30 minutes",
      500,
    );
  }

  return configuredDuration;
}

function validateSubmissionFields(request) {
  if (!request.categoryId) {
    throw new AppError("Service category is required", 400);
  }

  if (
    typeof request.description !== "string" ||
    !request.description.trim() ||
    request.description.trim().length > 5000
  ) {
    throw new AppError(
      "A valid repair description is required (maximum 5000 characters)",
      400,
    );
  }

  if (
    typeof request.serviceArea !== "string" ||
    !ALLOWED_SERVICE_AREAS.includes(request.serviceArea)
  ) {
    throw new AppError(
      "Service area must be Islamabad or Rawalpindi",
      400,
    );
  }

  if (
    typeof request.detailedAddress !== "string" ||
    !request.detailedAddress.trim() ||
    request.detailedAddress.trim().length > 500
  ) {
    throw new AppError(
      "A valid detailed address is required (maximum 500 characters)",
      400,
    );
  }

  if (request.isEmergency) {
    if (!ALLOWED_EMERGENCY_TYPES.includes(request.emergencyType)) {
      throw new AppError(
        "A valid emergency type is required for emergency requests",
        400,
      );
    }
  } else if (request.emergencyType !== null) {
    throw new AppError(
      "Non-emergency requests cannot have an emergency type",
      400,
    );
  }
}

/**
 * Create a repair request in DRAFT status.
 * Bidding starts only after final submission.
 */
export async function createRepairRequestDraft({
  userId,
  categoryId,
  description,
  isComplexJob = false,
  isEmergency = false,
  emergencyType = null,
  serviceArea,
  detailedAddress,
}) {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (
    typeof categoryId !== "string" ||
    !categoryId.trim()
  ) {
    throw new AppError("Service category is required", 400);
  }

  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    throw new AppError("Repair description is required", 400);
  }

  const cleanedDescription = description.trim();

  if (cleanedDescription.length > 5000) {
    throw new AppError(
      "Repair description cannot exceed 5000 characters",
      400,
    );
  }

  if (typeof isComplexJob !== "boolean") {
    throw new AppError("isComplexJob must be true or false", 400);
  }

  if (typeof isEmergency !== "boolean") {
    throw new AppError("isEmergency must be true or false", 400);
  }

  if (
    typeof serviceArea !== "string" ||
    !serviceArea.trim()
  ) {
    throw new AppError("Service area is required", 400);
  }

  const normalizedServiceArea = ALLOWED_SERVICE_AREAS.find(
    (area) =>
      area.toLowerCase() === serviceArea.trim().toLowerCase(),
  );

  if (!normalizedServiceArea) {
    throw new AppError(
      "Service area must be Islamabad or Rawalpindi",
      400,
    );
  }

  if (
    typeof detailedAddress !== "string" ||
    !detailedAddress.trim()
  ) {
    throw new AppError("Detailed address is required", 400);
  }

  const cleanedAddress = detailedAddress.trim();

  if (cleanedAddress.length > 500) {
    throw new AppError(
      "Detailed address cannot exceed 500 characters",
      400,
    );
  }

  let validatedEmergencyType = null;

  if (isEmergency) {
    if (
      typeof emergencyType !== "string" ||
      !ALLOWED_EMERGENCY_TYPES.includes(emergencyType)
    ) {
      throw new AppError(
        "A valid emergency type is required for emergency requests",
        400,
      );
    }

    validatedEmergencyType = emergencyType;
  } else if (
    emergencyType !== null &&
    emergencyType !== undefined &&
    emergencyType !== ""
  ) {
    throw new AppError(
      "Emergency type must only be provided for emergency requests",
      400,
    );
  }

  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId.trim() },
    select: { id: true },
  });

  if (!category) {
    throw new AppError("Service category not found", 404);
  }

  return prisma.repairRequest.create({
    data: {
      customerId: userId,
      categoryId: category.id,
      description: cleanedDescription,
      isComplexJob,
      isEmergency,
      emergencyType: validatedEmergencyType,
      serviceArea: normalizedServiceArea,
      detailedAddress: cleanedAddress,
      status: "DRAFT",
      submittedAt: null,
      biddingDurationMinutes: null,
      biddingDeadline: null,
    },
    select: {
      id: true,
      customerId: true,
      categoryId: true,
      description: true,
      isComplexJob: true,
      isEmergency: true,
      emergencyType: true,
      status: true,
      createdAt: true,
      serviceArea: true,
      detailedAddress: true,
      submittedAt: true,
      biddingDurationMinutes: true,
      biddingDeadline: true,
    },
  });
}

/**
 * Submit an existing draft and open it for bidding.
 *
 * Submission and deadline persistence happen in one transaction.
 * Repeated submissions of an already-open request are idempotent.
 */
export async function submitRepairRequest({ userId, requestId }) {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (
    typeof requestId !== "string" ||
    !requestId.trim()
  ) {
    throw new AppError("Repair request ID is required", 400);
  }

  return prisma.$transaction(async (tx) => {
    const request = await tx.repairRequest.findUnique({
      where: { id: requestId.trim() },
      select: {
        id: true,
        customerId: true,
        categoryId: true,
        description: true,
        isComplexJob: true,
        isEmergency: true,
        emergencyType: true,
        status: true,
        serviceArea: true,
        detailedAddress: true,
        submittedAt: true,
        biddingDurationMinutes: true,
        biddingDeadline: true,
      },
    });

    if (!request) {
      throw new AppError("Repair request not found", 404);
    }

    if (request.customerId !== userId) {
      throw new AppError(
        "You are not allowed to submit this repair request",
        403,
      );
    }

    // Return the existing result if this request was already submitted.
    // Do not reset its deadline on a retry.
    if (
      request.status === "OPEN" &&
      request.submittedAt &&
      request.biddingDurationMinutes !== null &&
      request.biddingDeadline
    ) {
      return {
        ...request,
        alreadySubmitted: true,
      };
    }

    if (request.status !== "DRAFT") {
      throw new AppError(
        "Only draft repair requests can be submitted",
        409,
      );
    }

    validateSubmissionFields(request);

    // Validate the media records saved in PostgreSQL, not just
    // the files previously sent to the upload endpoint.
    const media = await tx.requestMedia.findMany({
      where: { requestId: request.id },
      select: {
        id: true,
        mediaType: true,
        fileUrl: true,
      },
    });

    const images = media.filter(
      (item) => item.mediaType === "PHOTO",
    );

    const videos = media.filter(
      (item) => item.mediaType === "VIDEO",
    );

    if (images.length + videos.length === 0) {
      throw new AppError(
        "Upload at least one image or one video before submitting",
        400,
      );
    }

    if (images.length > 10) {
      throw new AppError(
        "A repair request cannot contain more than 10 images",
        400,
      );
    }

    if (videos.length > 1) {
      throw new AppError(
        "A repair request cannot contain more than one video",
        400,
      );
    }

    if (
      media.some(
        (item) =>
          !item.fileUrl ||
          !item.fileUrl.trim() ||
          !["PHOTO", "VIDEO"].includes(item.mediaType),
      )
    ) {
      throw new AppError(
        "One or more uploaded media records are invalid",
        400,
      );
    }

    const durationMinutes = request.isEmergency
      ? getEmergencyBiddingDuration()
      : NORMAL_BIDDING_DURATION_MINUTES;

    const submittedAt = new Date();
    const biddingDeadline = new Date(
      submittedAt.getTime() + durationMinutes * 60 * 1000,
    );

    // Conditional update prevents two requests from both changing
    // the same draft from DRAFT to OPEN.
    const result = await tx.repairRequest.updateMany({
      where: {
        id: request.id,
        customerId: userId,
        status: "DRAFT",
      },
      data: {
        status: "OPEN",
        submittedAt,
        biddingDurationMinutes: durationMinutes,
        biddingDeadline,
        lastActivityAt: submittedAt,
      },
    });

    if (result.count !== 1) {
      throw new AppError(
        "This draft has changed. Refresh the request and try again",
        409,
      );
    }

    const submittedRequest = await tx.repairRequest.findUnique({
      where: { id: request.id },
      select: {
        id: true,
        customerId: true,
        categoryId: true,
        description: true,
        isComplexJob: true,
        isEmergency: true,
        emergencyType: true,
        status: true,
        serviceArea: true,
        detailedAddress: true,
        submittedAt: true,
        biddingDurationMinutes: true,
        biddingDeadline: true,
      },
    });

    return {
      ...submittedRequest,
      alreadySubmitted: false,
    };
  });
}

/**
 * Get service categories for the repair request form.
 */
export async function getServiceCategories() {
  return prisma.serviceCategory.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  });
}
