import { compressImageForUpload, ImageCompressPreset } from "@/lib/compress-image";

export async function uploadCompressedImage(
  file: File,
  preset: ImageCompressPreset = "general"
): Promise<string> {
  const compressed = await compressImageForUpload(file, preset);
  const formData = new FormData();
  formData.append("file", compressed);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }

  const data = await res.json();
  return data.url as string;
}
