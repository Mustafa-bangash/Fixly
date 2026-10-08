import sharp from "sharp";

const optimizeImage = async (fileBuffer) => {
  const optimizedBuffer = await sharp(fileBuffer)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
      mozjpeg: true,
    })
    .toBuffer();

  // Never use an optimized image if it is larger
  // than the original image.
  if (optimizedBuffer.length >= fileBuffer.length) {
    return fileBuffer;
  }

  return optimizedBuffer;
};

export default {
  optimizeImage,
};