export type ImageCompressPreset = "avatar" | "logo" | "general";

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
}

const PRESETS: Record<ImageCompressPreset, CompressImageOptions> = {
  logo: { maxWidth: 512, maxHeight: 512, quality: 0.88, mimeType: "image/webp" },
  avatar: { maxWidth: 800, maxHeight: 800, quality: 0.85, mimeType: "image/webp" },
  general: { maxWidth: 1200, maxHeight: 1200, quality: 0.82, mimeType: "image/webp" },
};

/** Resize and re-encode images in the browser before upload to keep files small. */
export async function compressImage(
  file: File,
  options: CompressImageOptions = PRESETS.general
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    mimeType = "image/webp",
  } = options;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.${ext}`, { type: mimeType });
}

export function compressImageForUpload(
  file: File,
  preset: ImageCompressPreset = "general"
): Promise<File> {
  return compressImage(file, PRESETS[preset]);
}
