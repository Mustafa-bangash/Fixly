
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

        resolve({
          publicId: result.public_id,
          mediaUrl: result.secure_url,
          resourceType: result.resource_type,
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

  const cleanupResults = await Promise.allSettled(
    assets
      .filter((asset) => asset.publicId)
      .map((asset) =>
        cloudinary.uploader.destroy(asset.publicId, {
          resource_type: asset.resourceType,
        })
      )
  );

  cleanupResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Cloudinary cleanup failed:",
        result.reason
      );
    }
  });
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
    await deleteUploadedMedia({
      images: uploadedImages,
      video: null,
    });

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
    await deleteUploadedMedia({
      images: uploadedImages,
      video: uploadedVideo,
    });

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
