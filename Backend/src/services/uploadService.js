import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import videoMetadataService from "./videoMetadataService.js";
import imageOptimizationService from "./imageOptimizationService.js";
import videoOptimizationService from "./videoOptimizationService.js";

const MAX_VIDEO_DURATION = 5 * 60;

const uploadFile = (fileBuffer, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);

        if (!result?.public_id || !result?.secure_url) {
          return reject(new Error("Cloudinary returned an incomplete upload result"));
        }

        resolve({
          publicId: result.public_id,
          mediaUrl: result.secure_url,
          resourceType: result.resource_type || resourceType,
        });
      }
    );

    Readable.from([fileBuffer]).pipe(uploadStream);
  });
};

const uploadImage = async (fileBuffer) => {
  const optimizedBuffer =
    await imageOptimizationService.optimizeImage(fileBuffer);

  return uploadFile(
    optimizedBuffer,
    "image",
    "fixly/uploads/images"
  );
};

const uploadVideo = async (fileBuffer) => {
  const duration =
    await videoMetadataService.getVideoDuration(fileBuffer);

  if (duration > MAX_VIDEO_DURATION) {
    throw new Error("Video duration must not exceed 5 minutes");
  }

  const optimizedBuffer =
    await videoOptimizationService.optimizeVideo(fileBuffer);

  return uploadFile(
    optimizedBuffer,
    "video",
    "fixly/uploads/videos"
  );
};

const deleteUploadedMedia = async (media) => {
  if (!media) return;

  const assets = [
    ...(media.images || []),
    ...(media.video ? [media.video] : []),
  ];

  const results = await Promise.all(
    assets.map(async (asset) => {
      if (!asset.publicId) {
        return {
          asset,
          success: false,
          reason: "Missing Cloudinary public ID",
        };
      }

      try {
        const result = await cloudinary.uploader.destroy(
          asset.publicId,
          {
            resource_type: asset.resourceType ||
              (asset.mediaType === "VIDEO" ? "video" : "image"),
          }
        );

        // Deleting an already-missing asset is safe and idempotent.
        if (["ok", "not found"].includes(result?.result)) {
          return { asset, success: true };
        }

        return {
          asset,
          success: false,
          reason: "Cloudinary deletion was not confirmed",
        };
      } catch {
        return {
          asset,
          success: false,
          reason: "Cloudinary deletion operation failed",
        };
      }
    })
  );

  const failedAssets = results
    .filter((result) => !result.success)
    .map(({ asset, reason }) => ({ ...asset, cleanupError: reason }));

  if (failedAssets.length > 0) {
    const error = new Error("One or more Cloudinary assets could not be deleted");
    error.failedAssets = failedAssets;
    throw error;
  }
};

const cleanupAfterUploadFailure = async (media, originalError) => {
  try {
    await deleteUploadedMedia(media);
  } catch (cleanupError) {
    // Preserve the original upload error while exposing failed deletions
    // to the controller so they can be recorded for retry.
    originalError.cleanupFailedAssets = cleanupError.failedAssets || [];

    console.error("Some uploaded assets could not be cleaned up", {
      failedCount: originalError.cleanupFailedAssets.length,
    });
  }
};

const uploadImages = async (files) => {
  const uploadedImages = [];

  try {
    for (const file of files) {
      const image = await uploadImage(file.buffer);
      uploadedImages.push(image);
    }

    return uploadedImages;
  } catch (error) {
    await cleanupAfterUploadFailure(
      { images: uploadedImages, video: null },
      error
    );

    throw error;
  }
};

const uploadMedia = async (images = [], video = null) => {
  const uploadedImages = [];
  let uploadedVideo = null;

  try {
    for (const file of images) {
      const image = await uploadImage(file.buffer);
      uploadedImages.push(image);
    }

    if (video) {
      uploadedVideo = await uploadVideo(video.buffer);
    }

    return {
      images: uploadedImages,
      video: uploadedVideo,
    };
  } catch (error) {
    await cleanupAfterUploadFailure(
      { images: uploadedImages, video: uploadedVideo },
      error
    );

    throw error;
  }
};

export default {
  uploadImage,
  uploadVideo,
  uploadImages,
  uploadMedia,
  deleteUploadedMedia,
};