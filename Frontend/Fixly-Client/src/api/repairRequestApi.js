
import api from "./axiosInstance.js";

/**
 * Fetch available service categories.
 */
export async function getServiceCategories() {
  const response = await api.get("/repair-requests/categories");

  return response.data;
}

/**
 * Create a repair request draft.
 * The request remains in DRAFT status until final submission.
 */
export async function createRepairRequestDraft({
  categoryId,
  description,
  isComplexJob = false,
  isEmergency = false,
  emergencyType = null,
  serviceArea,
  detailedAddress,
}) {
  const response = await api.post("/repair-requests/drafts", {
    categoryId,
    description,
    isComplexJob,
    isEmergency,
    emergencyType,
    serviceArea,
    detailedAddress,
  });

  return response.data;
}

/**
 * Upload photos and/or a video to an existing repair request draft.
 */
export async function uploadRepairRequestMedia(
  requestId,
  images = [],
  video = null,
  onUploadProgress,
) {
  const formData = new FormData();

  images.forEach((item) => {
    formData.append("images", item.file ?? item);
  });

  if (video) {
    formData.append("video", video.file ?? video);
  }

  const response = await api.post(
    `/upload/${requestId}/media`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (onUploadProgress && event.total) {
          const percentage = Math.round(
            (event.loaded / event.total) * 100,
          );

          onUploadProgress(percentage);
        }
      },
    },
  );

  return response.data;
}

/**
 * Submit an existing repair request draft for bidding.
 * The backend validates the draft and determines its bidding deadline.
 */
export async function submitRepairRequest(requestId) {
  const response = await api.post(
    `/repair-requests/${requestId}/submit`,
  );

  return response.data;
}
