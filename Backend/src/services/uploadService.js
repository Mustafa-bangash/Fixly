import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "fixly/uploads",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            publicId: result.public_id,
            imageUrl: result.secure_url,
          });
        }
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export default {
  uploadImage,
};