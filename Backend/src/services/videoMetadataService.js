import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const getVideoDuration = async (fileBuffer) => {
  // Temporary file will be created only for FFprobe inspection
  const tempFilePath = `./temp-video-${Date.now()}.mp4`;

  try {
    // Import fs promises dynamically so we can work with the buffer
    const { writeFile, unlink } = await import("fs/promises");

    // Write the uploaded video buffer temporarily
    await writeFile(tempFilePath, fileBuffer);

    // Run FFprobe to get the actual video duration
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      tempFilePath,
    ]);

    const duration = Number.parseFloat(stdout.trim());

    if (!Number.isFinite(duration)) {
      throw new Error("Unable to determine video duration");
    }

    return duration;
  } finally {
    // Remove temporary file after inspection
    try {
      const { unlink } = await import("fs/promises");
      await unlink(tempFilePath);
    } catch {
      // Ignore cleanup error
    }
  }
};

export default {
  getVideoDuration,
};