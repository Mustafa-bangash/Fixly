
import { prisma } from "../config/prisma.js";
import uploadService from "../services/uploadService.js";

const DRAFT_EXPIRY_HOURS = 24;
const CLEANUP_RETRY_DELAY_MINUTES = 2;

const getExpiryCutoff = (now = new Date()) =>
  new Date(now.getTime() - DRAFT_EXPIRY_HOURS * 60 * 60 * 1000);

const getCleanupRetryTime = (now = new Date()) =>
  new Date(now.getTime() + CLEANUP_RETRY_DELAY_MINUTES * 60 * 1000);

const getAllUploadedAssets = (media) => [
  ...(media?.images || []),
  ...(media?.video ? [media.video] : []),
];

const recordFailedCleanup = async (requestId, failedAssets) => {
  if (!failedAssets?.length) return;

  const now = new Date();

  try {
    await prisma.requestMedia.createMany({
      data: failedAssets
        .filter((asset) => asset.publicId && asset.mediaUrl)
        .map((asset) => ({
          requestId,
          publicId: asset.publicId,
          fileUrl: asset.mediaUrl,
          mediaType:
            asset.resourceType === "video" ||
            asset.mediaType === "VIDEO"
              ? "VIDEO"
              : "PHOTO",
          stage: "BEFORE",
          cleanupStatus: "FAILED",
          cleanupAttempts: 1,
          cleanupLastError:
            asset.cleanupError ||
            "Cloudinary cleanup failed after an upload operation",
          cleanupRetryAt: getCleanupRetryTime(now),
        })),
    });
  } catch {
    console.error("Unable to persist failed media cleanup records", {
      requestId,
      failedAssetCount: failedAssets.length,
    });
  }
};

const cleanupUploadedAssets = async (requestId, media) => {
  if (!media) return;

  try {
    await uploadService.deleteUploadedMedia(media);
  } catch (error) {
    const failedAssets =
      error.failedAssets ||
      getAllUploadedAssets(media);

    console.error("Cloudinary cleanup requires retry", {
      requestId,
      failedAssetCount: failedAssets.length,
    });

    await recordFailedCleanup(requestId, failedAssets);
  }
};

const expireDraftIfInactive = async (requestId, userId, now) => {
  const cutoff = getExpiryCutoff(now);

  return prisma.$transaction(async (tx) => {
    const result = await tx.repairRequest.updateMany({
      where: {
        id: requestId,
        customerId: userId,
        status: "DRAFT",
        lastActivityAt: { lte: cutoff },
      },
      data: { status: "EXPIRED" },
    });

    if (result.count === 1) {
      await tx.requestMedia.updateMany({
        where: { requestId },
        data: {
          cleanupStatus: "PENDING",
          cleanupRetryAt: now,
          cleanupLastError: null,
        },
      });
    }

    return result.count === 1;
  });
};

const uploadMedia = async (req, res) => {
  let uploadedMedia = null;
  let requestId;

  try {
    requestId = req.params.requestId;
    const userId = req.user.id;

    const images = req.files?.images || [];
    const video = req.files?.video?.[0] || null;

    if (images.length === 0 && !video) {
      return res.status(400).json({
        success: false,
        message: "At least one image or one video is required",
      });
    }

    const draft = await prisma.repairRequest.findFirst({
      where: {
        id: requestId,
        customerId: userId,
        status: "DRAFT",
      },
      select: {
        id: true,
        lastActivityAt: true,
      },
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message:
          "Draft not found or you are not authorized to upload media",
      });
    }

    const now = new Date();
    const cutoff = getExpiryCutoff(now);

    if (draft.lastActivityAt <= cutoff) {
      await expireDraftIfInactive(requestId, userId, now);

      return res.status(410).json({
        success: false,
        message:
          "This draft has expired and no longer accepts media uploads",
      });
    }

    uploadedMedia = await uploadService.uploadMedia(images, video);

    const mediaRecords = [
      ...uploadedMedia.images.map((image) => ({
        requestId: draft.id,
        publicId: image.publicId,
        fileUrl: image.mediaUrl,
        mediaType: "PHOTO",
        stage: "BEFORE",
      })),
    ];

    if (uploadedMedia.video) {
      mediaRecords.push({
        requestId: draft.id,
        publicId: uploadedMedia.video.publicId,
        fileUrl: uploadedMedia.video.mediaUrl,
        mediaType: "VIDEO",
        stage: "BEFORE",
      });
    }

    const transactionResult = await prisma.$transaction(async (tx) => {
      const currentCutoff = getExpiryCutoff(new Date());
      const activityUpdate = await tx.repairRequest.updateMany({
        where: {
          id: draft.id,
          customerId: userId,
          status: "DRAFT",
          lastActivityAt: { gt: currentCutoff },
        },
        data: { lastActivityAt: new Date() },
      });

      if (activityUpdate.count !== 1) {
        return { accepted: false };
      }

      await tx.requestMedia.createMany({
        data: mediaRecords,
      });

      return { accepted: true };
    });

    if (!transactionResult.accepted) {
      await expireDraftIfInactive(requestId, userId, new Date());

      await cleanupUploadedAssets(requestId, uploadedMedia);
      uploadedMedia = null;

      return res.status(410).json({
        success: false,
        message:
          "This draft has expired or is no longer available for uploads",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Media uploaded and associated with the repair request",
      data: {
        requestId: draft.id,
        images: uploadedMedia.images,
        video: uploadedMedia.video,
      },
    });
  } catch (error) {
    console.error("Media upload operation failed", {
      requestId,
      errorName: error?.name || "UnknownError",
      errorCode: error?.code || "UNKNOWN",
    });

    if (uploadedMedia) {
      await cleanupUploadedAssets(requestId, uploadedMedia);
    }

    if (error.cleanupFailedAssets?.length && requestId) {
      await recordFailedCleanup(requestId, error.cleanupFailedAssets);
    }

    return res.status(500).json({
      success: false,
      message: "Media upload failed",
    });
  }
};

export default { uploadMedia };
