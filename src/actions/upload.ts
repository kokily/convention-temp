"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { createUploadUrl, IMAGE_BASE } from "@/lib/s3";

const MB = 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};
const FILE_EXTENSIONS = new Set([
  "pdf",
  "hwp",
  "hwpx",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "zip",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
]);

export async function createImageUpload(type: string, size: number) {
  await requireAdmin();

  const extension = IMAGE_TYPES[type];
  if (!extension) return { error: "JPG, PNG, GIF, WebP 이미지만 올릴 수 있습니다." };
  if (size > 10 * MB) return { error: "이미지는 10MB까지 올릴 수 있습니다." };

  const key = `images/${randomUUID()}.${extension}`;

  return { uploadUrl: await createUploadUrl(key, type), publicUrl: `${IMAGE_BASE}${key}` };
}

export async function createFileUpload(fileName: string, size: number) {
  await requireAdmin();

  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!FILE_EXTENSIONS.has(extension)) return { error: `${fileName}: 허용되지 않는 파일 형식입니다.` };
  if (size > 50 * MB) return { error: `${fileName}: 파일은 50MB까지 올릴 수 있습니다.` };

  const s3Key = `files/${randomUUID()}.${extension}`;
  const contentType = "application/octet-stream";

  return { uploadUrl: await createUploadUrl(s3Key, contentType), s3Key, contentType };
}
