
import { useEffect, useState } from 'react';
import {
  createRepairRequestDraft,
  getServiceCategories,
  uploadRepairRequestMedia,
  submitRepairRequest,
} from '../../api/repairRequestApi.js';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_DURATION = 5 * 60;

const EMERGENCY_TYPES = [
  { value: 'GAS_LEAK', label: 'Gas leak' },
  { value: 'ELECTRICAL_SPARK', label: 'Electrical sparks' },
  { value: 'FLOODING', label: 'Flooding' },
];

function MediaPreview({ item, isVideo, onRemove, disabled }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(item.file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [item.file]);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {previewUrl &&
        (isVideo ? (
          <video
            src={previewUrl}
            controls
            preload="metadata"
            className="h-40 w-full object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt={item.file.name}
            className="h-40 w-full object-cover"
          />
        ))}

      <div className="p-3">
        <p className="truncate text-sm font-medium text-gray-700">
          {item.file.name}
        </p>
        <p className="text-xs text-gray-500">
          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
        </p>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          className="mt-2 rounded-md border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function isValidImage(file) {
  return (
    ['jpg', 'jpeg', 'png'].includes(getFileExtension(file.name)) &&
    ['image/jpeg', 'image/png'].includes(file.type)
  );
}

function isValidVideo(file) {
  return (
    getFileExtension(file.name) === 'mp4' &&
    file.type === 'video/mp4'
  );
}

function checkVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    let settled = false;

    function cleanup() {
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      video.load();
    }

    function finish(callback, value) {
      if (settled) return;
      settled = true;
      cleanup();
      callback(value);
    }

    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration)) {
        finish(reject, new Error('Unable to read the video duration.'));
      } else if (video.duration > MAX_VIDEO_DURATION) {
        finish(reject, new Error('Video duration must not exceed 5 minutes.'));
      } else {
        finish(resolve);
      }
    };

    video.onerror = () => {
      finish(reject, new Error('Unable to read this video file.'));
    };

    video.src = url;
  });
}

function formatDateTime(value) {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString();
}

export default function CreateRepairRequestPage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [isComplexJob, setIsComplexJob] = useState(false);

  const [serviceArea, setServiceArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const [error, setError] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [savedDraft, setSavedDraft] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [checkingVideo, setCheckingVideo] = useState(false);

  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [uploadedMediaResult, setUploadedMediaResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const result = await getServiceCategories();

        if (!cancelled) {
          setCategories(result.categories ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Unable to load service categories. Please try again.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleImageSelection(event) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = '';
    setMediaError('');

    if (imageFiles.length + selectedFiles.length > MAX_IMAGES) {
      setMediaError('You can select a maximum of 10 images.');
      return;
    }

    for (const file of selectedFiles) {
      if (!isValidImage(file)) {
        setMediaError('Only JPG, JPEG, and PNG images are allowed.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setMediaError(`${file.name} exceeds the 100 MB file-size limit.`);
        return;
      }
    }

    const newItems = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random()}`,
      file,
    }));

    setImageFiles((current) => [...current, ...newItems]);
  }

  async function handleVideoSelection(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setMediaError('');

    if (!file) return;

    if (videoFile) {
      setMediaError('Only one video is allowed. Remove the current video first.');
      return;
    }

    if (!isValidVideo(file)) {
      setMediaError('Only MP4 videos are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMediaError('The video exceeds the 100 MB file-size limit.');
      return;
    }

    setCheckingVideo(true);

    try {
      await checkVideoDuration(file);

      setVideoFile({
        id: `${Date.now()}-${Math.random()}`,
        file,
      });
    } catch (err) {
      setMediaError(err.message || 'Unable to validate the video.');
    } finally {
      setCheckingVideo(false);
    }
  }

  function removeImage(id) {
    setImageFiles((current) => current.filter((item) => item.id !== id));
  }

  function removeVideo(id) {
    setVideoFile((current) => (current?.id === id ? null : current));
  }

  async function handleSaveDraft(event) {
    event.preventDefault();
    setError('');

    if (savingDraft || savedDraft) return;

    if (!categoryId) {
      setError('Please select a service category.');
      return;
    }

    if (!description.trim()) {
      setError('Please describe the repair you need.');
      return;
    }

    if (description.trim().length > 5000) {
      setError('Description cannot exceed 5000 characters.');
      return;
    }

    if (!serviceArea) {
      setError('Please select your service area.');
      return;
    }

    if (!detailedAddress.trim()) {
      setError('Please enter your detailed service address.');
      return;
    }

    if (detailedAddress.trim().length > 500) {
      setError('Detailed address cannot exceed 500 characters.');
      return;
    }

    if (isEmergency && !emergencyType) {
      setError('Please select the type of emergency.');
      return;
    }

    setSavingDraft(true);

    try {
      const result = await createRepairRequestDraft({
        categoryId,
        description: description.trim(),
        isComplexJob,
        isEmergency,
        emergencyType: isEmergency ? emergencyType : null,
        serviceArea,
        detailedAddress: detailedAddress.trim(),
      });

      const draft = result.draft ?? result.request ?? result;

      if (!draft.id || draft.status !== 'DRAFT') {
        throw new Error(
          'The server response did not confirm that the draft was saved.',
        );
      }

      setSavedDraft(draft);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to save your draft. Please try again.',
      );
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleMediaUpload() {
    if (!savedDraft?.id) {
      setMediaError('Please save the repair-request draft first.');
      return;
    }

    if (imageFiles.length === 0 && !videoFile) {
      setMediaError('Please select at least one image or one video.');
      return;
    }

    if (mediaUploaded || uploadingMedia || checkingVideo) return;

    setMediaError('');
    setUploadProgress(0);
    setUploadingMedia(true);

    try {
      const result = await uploadRepairRequestMedia(
        savedDraft.id,
        imageFiles,
        videoFile,
        setUploadProgress,
      );

      if (!result.success) {
        throw new Error(result.message || 'Media upload failed.');
      }

      setUploadedMediaResult(result.data);
      setMediaUploaded(true);
      setUploadProgress(100);
    } catch (err) {
      setMediaError(
        err.response?.data?.message ||
          err.message ||
          'Unable to upload media. Please try again.',
      );
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleFinalSubmission() {
    if (!savedDraft?.id || !mediaUploaded || submittingRequest) return;

    setError('');
    setSubmittingRequest(true);

    try {
      const result = await submitRepairRequest(savedDraft.id);

      const submittedRequest = result.request;

      if (
        !submittedRequest?.id ||
        submittedRequest.status !== 'OPEN' ||
        !submittedRequest.submittedAt ||
        !submittedRequest.biddingDeadline
      ) {
        throw new Error(
          'The server did not confirm the submitted request and deadline. Please retry safely.',
        );
      }

      setSubmissionResult(result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to submit your request. Please try again.',
      );
    } finally {
      setSubmittingRequest(false);
    }
  }

  function resetForm() {
    setCategories((current) => current);

    setCategoryId('');
    setDescription('');
    setIsComplexJob(false);
    setServiceArea('');
    setDetailedAddress('');
    setIsEmergency(false);
    setEmergencyType('');

    setSavedDraft(null);
    setSubmissionResult(null);
    setImageFiles([]);
    setVideoFile(null);
    setMediaError('');
    setError('');
    setMediaUploaded(false);
    setUploadedMediaResult(null);
    setUploadProgress(0);
    setSavingDraft(false);
    setUploadingMedia(false);
    setSubmittingRequest(false);
    setCheckingVideo(false);
  }

  if (submissionResult) {
    const request = submissionResult.request;

    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
          <div
            role="status"
            className="rounded-lg bg-green-50 p-4 text-green-800"
          >
            <h1 className="text-2xl font-bold">
              Repair request submitted successfully!
            </h1>
            <p className="mt-2">
              Your request is now open for provider bids.
            </p>
          </div>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Submission confirmation
          </h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Request ID</dt>
              <dd className="break-all font-medium text-gray-900">
                {request.id}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-semibold text-green-700">
                {request.status}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Service category</dt>
              <dd className="font-medium text-gray-900">
                {categories.find((item) => item.id === request.categoryId)?.name ||
                  'Selected service'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Description</dt>
              <dd className="whitespace-pre-wrap text-gray-900">
                {request.description}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Service area</dt>
              <dd className="text-gray-900">{request.serviceArea}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Detailed address</dt>
              <dd className="text-gray-900">{request.detailedAddress}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Emergency</dt>
              <dd className="text-gray-900">
                {request.isEmergency ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Submitted at</dt>
              <dd className="text-gray-900">
                {formatDateTime(request.submittedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Bidding deadline</dt>
              <dd className="font-semibold text-gray-900">
                {formatDateTime(request.biddingDeadline)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Bidding duration</dt>
              <dd className="text-gray-900">
                {request.biddingDurationMinutes === 15
                  ? '15 minutes (emergency)'
                  : request.biddingDurationMinutes === 2880
                    ? '48 hours'
                    : `${request.biddingDurationMinutes} minutes`}
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-sm text-gray-600">
            The status and deadline above were returned by the server.
            Keep your request ID for future reference.
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create another repair request
          </button>
        </div>
      </section>
    );
  }

  if (savedDraft) {
    const mediaControlsDisabled =
      uploadingMedia || mediaUploaded || checkingVideo || submittingRequest;

    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Draft saved successfully
          </h1>

          <p className="mt-3 text-gray-600">
            Your repair details have been saved. Your request is not
            open for bidding until you submit it.
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p className="break-all">
              Draft ID: <strong>{savedDraft.id}</strong>
            </p>
            <p>
              Service area: <strong>{savedDraft.serviceArea}</strong>
            </p>
            <p>
              Detailed address: <strong>{savedDraft.detailedAddress}</strong>
            </p>
            <p>
              Emergency: <strong>{savedDraft.isEmergency ? 'Yes' : 'No'}</strong>
            </p>
            {savedDraft.isEmergency && (
              <p>
                Emergency type:{' '}
                <strong>
                  {EMERGENCY_TYPES.find(
                    (item) => item.value === savedDraft.emergencyType,
                  )?.label || savedDraft.emergencyType}
                </strong>
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Attach photos and video
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Select at least one photo or one video. You can attach
              up to 10 images and one MP4 video.
            </p>

            {mediaError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {mediaError}
              </div>
            )}

            <div className="mt-5">
              <label
                htmlFor="repairImages"
                className="mb-2 block font-medium text-gray-800"
              >
                Repair photos ({imageFiles.length}/{MAX_IMAGES})
              </label>

              <input
                id="repairImages"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                multiple
                disabled={mediaControlsDisabled}
                onChange={handleImageSelection}
                className="block w-full rounded-lg border border-gray-300 p-3 text-sm disabled:opacity-60"
              />

              <p className="mt-1 text-xs text-gray-500">
                JPG, JPEG, or PNG. Maximum 100 MB per file.
              </p>
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {imageFiles.map((item) => (
                  <MediaPreview
                    key={item.id}
                    item={item}
                    isVideo={false}
                    onRemove={removeImage}
                    disabled={mediaControlsDisabled}
                  />
                ))}
              </div>
            )}

            <div className="mt-6">
              <label
                htmlFor="repairVideo"
                className="mb-2 block font-medium text-gray-800"
              >
                Repair video {videoFile ? '(1/1)' : '(0/1)'}
              </label>

              <input
                id="repairVideo"
                type="file"
                accept=".mp4,video/mp4"
                disabled={mediaControlsDisabled || Boolean(videoFile)}
                onChange={handleVideoSelection}
                className="block w-full rounded-lg border border-gray-300 p-3 text-sm disabled:opacity-60"
              />

              <p className="mt-1 text-xs text-gray-500">
                MP4 only, maximum 5 minutes and 100 MB.
              </p>

              {checkingVideo && (
                <p className="mt-2 text-sm text-gray-600">
                  Checking video duration...
                </p>
              )}
            </div>

            {videoFile && (
              <div className="mt-4 max-w-md">
                <MediaPreview
                  item={videoFile}
                  isVideo
                  onRemove={removeVideo}
                  disabled={mediaControlsDisabled}
                />
              </div>
            )}

            <p className="mt-5 text-sm text-gray-600">
              Selected media: {imageFiles.length} image(s)
              {videoFile ? ' and 1 video' : ''}.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleMediaUpload}
                disabled={
                  uploadingMedia ||
                  mediaUploaded ||
                  checkingVideo ||
                  submittingRequest ||
                  (imageFiles.length === 0 && !videoFile)
                }
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingMedia
                  ? 'Uploading media...'
                  : mediaUploaded
                    ? 'Media uploaded successfully'
                    : 'Upload Media'}
              </button>

              {uploadingMedia && (
                <div className="mt-3">
                  <div
                    className="h-2 overflow-hidden rounded-full bg-gray-200"
                    role="progressbar"
                    aria-label="Media upload progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={uploadProgress}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-sm text-gray-600">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              {mediaUploaded && (
                <p
                  role="status"
                  className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                  Your media has been uploaded and associated with this
                  repair-request draft.
                </p>
              )}

              {mediaUploaded && uploadedMediaResult && (
                <p className="mt-2 text-sm text-gray-600">
                  Uploaded {uploadedMediaResult.images?.length ?? 0} image(s)
                  {uploadedMediaResult.video ? ' and 1 video' : ''}.
                </p>
              )}
            </div>

            {!mediaUploaded && (
              <p className="mt-2 text-sm text-amber-700">
                Your selected files are previews only until you upload them.
                If an upload fails, you can retry.
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {mediaUploaded && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Submit your repair request
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Once submitted, your request will open for provider bids.
                The server will determine the bidding deadline.
              </p>

              <button
                type="button"
                onClick={handleFinalSubmission}
                disabled={submittingRequest || uploadingMedia}
                className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingRequest
                  ? 'Submitting request...'
                  : 'Submit Repair Request'}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={resetForm}
            disabled={uploadingMedia || submittingRequest}
            className="mt-6 rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            Start another draft
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create a Repair Request
        </h1>

        <p className="mt-2 text-gray-600">
          Describe the problem so suitable service providers can
          understand what needs to be repaired.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loadingCategories ? (
          <p className="mt-6 text-gray-600">
            Loading service categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="mt-6 text-gray-600">
            No service categories are currently available. Please try
            again later.
          </p>
        ) : (
          <form onSubmit={handleSaveDraft} className="mt-6 space-y-6">
            <div>
              <label
                htmlFor="categoryId"
                className="mb-2 block font-medium text-gray-800"
              >
                Service category <span className="text-red-600">*</span>
              </label>

              <select
                id="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                disabled={savingDraft}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-medium text-gray-800"
              >
                Describe the repair <span className="text-red-600">*</span>
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="For example: Water is leaking from the pipe under my kitchen sink."
                rows={6}
                maxLength={5000}
                required
                disabled={savingDraft}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3"
              />

              <p className="mt-1 text-right text-sm text-gray-500">
                {description.length}/5000 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="serviceArea"
                className="mb-2 block font-medium text-gray-800"
              >
                Service area <span className="text-red-600">*</span>
              </label>

              <select
                id="serviceArea"
                value={serviceArea}
                onChange={(event) => setServiceArea(event.target.value)}
                required
                disabled={savingDraft}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">Select your service area</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="detailedAddress"
                className="mb-2 block font-medium text-gray-800"
              >
                Detailed service address <span className="text-red-600">*</span>
              </label>

              <textarea
                id="detailedAddress"
                value={detailedAddress}
                onChange={(event) => setDetailedAddress(event.target.value)}
                placeholder="Enter sector, street, house/building number, and nearby landmark."
                rows={3}
                maxLength={500}
                required
                disabled={savingDraft}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3"
              />

              <p className="mt-1 text-right text-sm text-gray-500">
                {detailedAddress.length}/500 characters
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-800">
                Is this an emergency? <span className="text-red-600">*</span>
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Select emergency only for urgent situations requiring
                immediate attention.
              </p>

              <div className="mt-3 flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isEmergency"
                    checked={!isEmergency}
                    onChange={() => {
                      setIsEmergency(false);
                      setEmergencyType('');
                    }}
                    disabled={savingDraft}
                    className="h-4 w-4"
                  />
                  No
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isEmergency"
                    checked={isEmergency}
                    onChange={() => setIsEmergency(true)}
                    disabled={savingDraft}
                    className="h-4 w-4"
                  />
                  Yes
                </label>
              </div>

              {isEmergency && (
                <div className="mt-4">
                  <label
                    htmlFor="emergencyType"
                    className="mb-2 block font-medium text-gray-800"
                  >
                    Emergency type <span className="text-red-600">*</span>
                  </label>

                  <select
                    id="emergencyType"
                    value={emergencyType}
                    onChange={(event) => setEmergencyType(event.target.value)}
                    required
                    disabled={savingDraft}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                  >
                    <option value="">Select emergency type</option>
                    {EMERGENCY_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isComplexJob}
                onChange={(event) => setIsComplexJob(event.target.checked)}
                disabled={savingDraft}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="block font-medium text-gray-800">
                  This is a complex repair
                </span>
                <span className="mt-1 block text-sm text-gray-600">
                  Select this if the repair may require multiple steps
                  or specialized work.
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={savingDraft || loadingCategories}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingDraft ? 'Saving draft...' : 'Save and Continue'}
            </button>

            <p className="text-sm text-gray-500">
              This step saves a draft only. Your request will not open
              for bidding until you upload media and submit it.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
