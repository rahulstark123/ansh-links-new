import { MAX_IMAGE_UPLOAD_SIZE } from "@/lib/compress-image";
import { uploadCompressedImage } from "@/lib/upload-image";

export const MAX_TICKET_ATTACHMENTS = 3;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export interface TicketAttachmentInput {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export function validateTicketAttachment(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Only images (JPG, PNG, WebP, GIF) or PDF files are allowed.";
  }
  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `"${file.name}" must be 2 MB or smaller. Your file is ${sizeMb} MB.`;
  }
  return null;
}

async function uploadRawFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

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

export async function uploadTicketAttachment(file: File): Promise<TicketAttachmentInput> {
  const validationError = validateTicketAttachment(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (file.type.startsWith("image/")) {
    const url = await uploadCompressedImage(file, "general");
    return {
      fileName: file.name,
      fileUrl: url,
      fileSize: file.size,
      mimeType: file.type,
    };
  }

  const url = await uploadRawFile(file);
  return {
    fileName: file.name,
    fileUrl: url,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export async function uploadTicketAttachments(files: File[]): Promise<TicketAttachmentInput[]> {
  if (files.length > MAX_TICKET_ATTACHMENTS) {
    throw new Error(`You can attach up to ${MAX_TICKET_ATTACHMENTS} files only.`);
  }

  const results: TicketAttachmentInput[] = [];
  for (const file of files) {
    results.push(await uploadTicketAttachment(file));
  }
  return results;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
