import {prisma} from "../config/prisma.js";
import uploadService from "../services/uploadService.js";

const uploadMedia = async (req, res) => {
  let uploadedMedia = null;

  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const images = req.files?.images || [];
    const video = req.files?.video?.[0] || null;

    if (images.length === 0 && !video) {
      return res.status(400).json({
        success: false,
        message: "At least one image or one video is required",
      });
    }

    // Confirm that this draft belongs to the logged-in customer.
    const draft = await prisma.repairRequest.findFirst({
      where: {
        id: requestId,
        customerId: userId,
        status: "DRAFT",
      },
      select: {
        id: true,
      },
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found or you are not authorized to upload media",
      });
    }

    // Upload and optimize files using the existing service.
    uploadedMedia = await uploadService.uploadMedia(images, video);

    // Prepare database records.
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

    // Save media records and update draft activity atomically.
    await prisma.$transaction([
      prisma.requestMedia.createMany({
        data: mediaRecords,
      }),
      prisma.repairRequest.update({
        where: { id: draft.id },
        data: { lastActivityAt: new Date() },
      }),
    ]);

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
    console.error("Media upload controller error:", error);

    if (uploadedMedia) {
      try {
        await uploadService.deleteUploadedMedia(uploadedMedia);
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup error:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Media upload failed",
    });
  }
};

export default { uploadMedia };
