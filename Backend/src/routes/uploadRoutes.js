// import express from "express";
// import upload from "../middleware/uploadMiddleware.js";
// import uploadController from "../controllers/uploadController.js";

// const router = express.Router();

// router.post(
//   "/media",
//   upload.fields([
//     { name: "images", maxCount: 10 },
//     { name: "video", maxCount: 1 },
//   ]),
//   uploadController.uploadMedia
// );

// export default router;



import express from "express";
import multer from "multer";
import upload from "../middleware/uploadMiddleware.js";
import uploadController from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/media",
  (req, res, next) => {
    upload.fields([
      { name: "images", maxCount: 10 },
      { name: "video", maxCount: 1 },
    ])(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          if (error.field === "images") {
            return res.status(400).json({
              success: false,
              message: "Maximum 10 images are allowed",
            });
          }

          if (error.field === "video") {
            return res.status(400).json({
              success: false,
              message: "Only 1 video is allowed",
            });
          }

          return res.status(400).json({
            success: false,
            message: "Unexpected file field",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next();
    });
  },
  uploadController.uploadMedia
);

export default router;