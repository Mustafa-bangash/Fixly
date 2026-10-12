import { execFile } from "child_process";
import { promisify } from "util";
import {
  writeFile,
  readFile,
  unlink,
} from "fs/promises";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

const optimizeVideo = async (fileBuffer) => {
  const tempDirectory = os.tmpdir();

  const inputPath = path.join(
    tempDirectory,
    `fixly-input-${Date.now()}.mp4`
  );

  const outputPath = path.join(
    tempDirectory,
    `fixly-output-${Date.now()}.mp4`
  );

  try {
    await writeFile(inputPath, fileBuffer);

    await execFileAsync("ffmpeg", [
      "-i",
      inputPath,

      "-vf",
      "scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2",

      "-c:v",
      "libx264",

      "-preset",
      "medium",

      "-crf",
      "28",

      "-c:a",
      "aac",

      "-b:a",
      "128k",

      "-movflags",
      "+faststart",

      outputPath,
    ]);

    const optimizedBuffer = await readFile(
      outputPath
    );

    // Never use the optimized video if it is
    // larger than or equal to the original.
    if (optimizedBuffer.length >= fileBuffer.length) {
      return fileBuffer;
    }

    return optimizedBuffer;
  } finally {
    try {
      await unlink(inputPath);
    } catch {}

    try {
      await unlink(outputPath);
    } catch {}
  }
};

export default {
  optimizeVideo,
};