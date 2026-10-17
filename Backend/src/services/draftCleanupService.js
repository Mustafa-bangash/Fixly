
import { prisma } from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

const DRAFT_EXPIRY_HOURS = 24;
const CLEANUP_BATCH_SIZE = 100;
const MAX_RETRY_DELAY_MINUTES = 60;

function getExpiryCutoff(now) {
  return new Date(
    now.getTime() - DRAFT_EXPIRY_HOURS * 60 * 60 * 1000,
  );
}

function getRetryTime(now, attempts) {
  const delayMinutes = Math.min(
    MAX_RETRY_DELAY_MINUTES,
    2 ** Math.max(0, attempts - 1),
  );

  return new Date(now.getTime() + delayMinutes * 60 * 1000);
}

/**
 * Expire inactive drafts and mark their media for cleanup.
 *
 * Only drafts inactive for at least 24 hours are expired.
 * A conditional update prevents a draft that has become
 * active from being expired using an outdated query result.
 */
async function expireAbandonedDrafts(now = new Date()) {
  const cutoff = getExpiryCutoff(now);

  const candidates = await prisma.repairRequest.findMany({
    where: {
      status: "DRAFT",
      lastActivityAt: {
        lte: cutoff,
      },
    },
    select: {
      id: true,
    },
    take: CLEANUP_BATCH_SIZE,
    orderBy: {
      lastActivityAt: "asc",
    },
  });

  let expiredCount = 0;

  for (const candidate of candidates) {
    const expired = await prisma.$transaction(async (tx) => {
      const result = await tx.repairRequest.updateMany({
        where: {
          id: candidate.id,
          status: "DRAFT",
          lastActivityAt: {
            lte: cutoff,
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      if (result.count !== 1) {
        return false;
      }

      await tx.requestMedia.updateMany({
        where: {
          requestId: candidate.id,
        },
        data: {
          cleanupStatus: "PENDING",
          cleanupRetryAt: now,
          cleanupLastError: null,
        },
      });

      return true;
    });

    if (expired) {
      expiredCount += 1;
    }
  }

  return expiredCount;
}

/**
 * Delete one Cloudinary asset.
 *
 * A missing asset is treated as already deleted, making
 * retries safe after a previous deletion succeeded.
 */
async function deleteCloudinaryAsset(media) {
  if (!media.publicId) {
    throw new Error("MISSING_PUBLIC_ID");
  }

  const resourceType =
    media.mediaType === "VIDEO" ? "video" : "image";

  const result = await cloudinary.uploader.destroy(
    media.publicId,
    {
      resource_type: resourceType,
    },
  );

  if (!["ok", "not found"].includes(result.result)) {
    throw new Error("CLOUDINARY_DELETE_FAILED");
  }
}

/**
 * Process media pending cleanup or due for retry.
 */
async function cleanupPendingMedia(now = new Date()) {
  const mediaItems = await prisma.requestMedia.findMany({
    where: {
      cleanupStatus: {
        in: ["PENDING", "FAILED"],
      },
      OR: [
        {
          cleanupRetryAt: null,
        },
        {
          cleanupRetryAt: {
            lte: now,
          },
        },
      ],
    },
    select: {
      id: true,
      requestId: true,
      publicId: true,
      mediaType: true,
      cleanupAttempts: true,
    },
    take: CLEANUP_BATCH_SIZE,
    orderBy: {
      createdAt: "asc",
    },
  });

  let cleanedCount = 0;
  let failedCount = 0;

  for (const media of mediaItems) {
    try {
      await deleteCloudinaryAsset(media);

      await prisma.requestMedia.deleteMany({
        where: {
          id: media.id,
          cleanupStatus: {
            in: ["PENDING", "FAILED"],
          },
        },
      });

      cleanedCount += 1;
    } catch (error) {
      const attempts = media.cleanupAttempts + 1;
      const retryAt = getRetryTime(now, attempts);

      // Store only a safe error category, never credentials
      // or raw provider error details.
      const safeError =
        error.message === "MISSING_PUBLIC_ID"
          ? "Missing Cloudinary public ID"
          : error.message === "CLOUDINARY_DELETE_FAILED"
            ? "Cloudinary deletion was not confirmed"
            : "Media cleanup operation failed";

      try {
        await prisma.requestMedia.updateMany({
          where: {
            id: media.id,
            cleanupStatus: {
              in: ["PENDING", "FAILED"],
            },
          },
          data: {
            cleanupStatus: "FAILED",
            cleanupAttempts: attempts,
            cleanupLastError: safeError,
            cleanupRetryAt: retryAt,
          },
        });
      } catch {
        console.error("Unable to record media cleanup failure", {
          mediaId: media.id,
          requestId: media.requestId,
        });
      }

      console.error("Media cleanup failed", {
        mediaId: media.id,
        requestId: media.requestId,
        reason: safeError,
      });

      failedCount += 1;
    }
  }

  return {
    processedCount: mediaItems.length,
    cleanedCount,
    failedCount,
  };
}

/**
 * Run one complete draft cleanup cycle.
 */
async function runDraftCleanup(now = new Date()) {
  const expiredCount = await expireAbandonedDrafts(now);
  const mediaResults = await cleanupPendingMedia(now);

  return {
    expiredCount,
    ...mediaResults,
  };
}

export {
  expireAbandonedDrafts,
  cleanupPendingMedia,
  runDraftCleanup,
};
