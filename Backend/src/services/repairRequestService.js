
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/apperror.js";

/**
 * Create a repair request in DRAFT status.
 * The bidding deadline starts only after final submission.
 */
export async function createRepairRequestDraft({
  userId,
  categoryId,
  description,
  isComplexJob = false,
  isEmergency = false,
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

  if (description.trim().length > 5000) {
    throw new AppError(
      "Repair description cannot exceed 5000 characters",
      400,
    );
  }

  if (typeof isComplexJob !== "boolean") {
    throw new AppError(
      "isComplexJob must be true or false",
      400,
    );
  }

  if (typeof isEmergency !== "boolean") {
    throw new AppError(
      "isEmergency must be true or false",
      400,
    );
  }

  const category = await prisma.serviceCategory.findUnique({
    where: {
      id: categoryId.trim(),
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new AppError("Service category not found", 404);
  }

  const draft = await prisma.repairRequest.create({
    data: {
      customerId: userId,
      categoryId: category.id,
      description: description.trim(),
      isComplexJob,
      isEmergency,
      status: "DRAFT",
      submittedAt: null,
      biddingDeadline: null,
    },
    select: {
      id: true,
      customerId: true,
      categoryId: true,
      description: true,
      isComplexJob: true,
      isEmergency: true,
      status: true,
      createdAt: true,
      serviceArea: true,
      detailedAddress: true,
      submittedAt: true,
      biddingDurationMinutes: true,
      biddingDeadline: true,
    },
  });

  return draft;
}
