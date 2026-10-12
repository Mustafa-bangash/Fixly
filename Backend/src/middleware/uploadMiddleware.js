import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedImageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
];

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
];

const allowedVideoExtensions = [
  ".mp4",
];

const allowedVideoMimeTypes = [
  "video/mp4",
];

const fileFilter = (req, file, cb) => {
  const fileExtension = path
    .extname(file.originalname)
    .toLowerCase();

  if (file.fieldname === "images") {
    const isValidExtension =
      allowedImageExtensions.includes(fileExtension);

    const isValidMimeType =
      allowedImageMimeTypes.includes(file.mimetype);

    if (isValidExtension && isValidMimeType) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG, and PNG images are allowed"
      ),
      false
    );
  }

  if (file.fieldname === "video") {
    const isValidExtension =
      allowedVideoExtensions.includes(fileExtension);

    const isValidMimeType =
      allowedVideoMimeTypes.includes(file.mimetype);

    if (isValidExtension && isValidMimeType) {
      return cb(null, true);
    }

    return cb(
      new Error("Only MP4 videos are allowed"),
      false
    );
  }

  return cb(
    new Error("Invalid file field"),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 11,
  },
});

export default upload;