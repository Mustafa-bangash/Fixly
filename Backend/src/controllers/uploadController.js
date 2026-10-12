import uploadService from "../services/uploadService.js";

const uploadMedia = async (req, res) => {
  try {
    const images = req.files?.images || [];
    const video = req.files?.video?.[0] || null;

    // At least one media file is required
    if (images.length === 0 && !video) {
      return res.status(400).json({
        success: false,
        message: "At least one image or one video is required",
      });
    }

    const result = await uploadService.uploadMedia(
      images,
      video
    );

    return res.status(200).json({
      success: true,
      message: "Media uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Media upload controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Media upload failed",
      error: error.message,
    });
  }
};

export default {
  uploadMedia,
};