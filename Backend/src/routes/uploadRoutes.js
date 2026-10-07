import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import uploadController from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  uploadController.uploadImage
);

export default router;