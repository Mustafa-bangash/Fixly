import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import videoMetadataService from "./videoMetadataService.js";
import imageOptimizationService from "./imageOptimizationService.js";
import videoOptimizationService from "./videoOptimizationService.js";

const MAX_VIDEO_DURATION = 5 * 60; // 5 minutes in seconds

const uploadFile = (
  fileBuffer,
  resourceType,
  folder
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

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
    await imageOptimizationService.optimizeImage(
      fileBuffer
    );

  return uploadFile(
    optimizedBuffer,
    "image",
    "fixly/uploads/images"
  );
};


const uploadVideo = async (fileBuffer) => {
  const duration =
    await videoMetadataService.getVideoDuration(
      fileBuffer
    );

  if (duration > MAX_VIDEO_DURATION) {
    throw new Error(
      "Video duration must not exceed 5 minutes"
    );
  }

  const optimizedBuffer =
    await videoOptimizationService.optimizeVideo(
      fileBuffer
    );

  return uploadFile(
    optimizedBuffer,
    "video",
    "fixly/uploads/videos"
  );
};

const uploadImages = async (files) => {
  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadImage(file.buffer)
    )
  );

  return uploadedImages;
};

const uploadMedia = async (
  images = [],
  video = null
) => {
  const imageResults =
    await uploadImages(images);

  let videoResult = null;

  if (video) {
    videoResult =
      await uploadVideo(video.buffer);
  }

  return {
    images: imageResults,
    video: videoResult,
  };
};

export default {
  uploadImage,
  uploadVideo,
  uploadImages,
  uploadMedia,
};