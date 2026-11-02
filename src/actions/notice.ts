"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { attachments, notices } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { cleanHtml, toPlainText } from "@/lib/html";
import { getAttachments, getNotice } from "@/lib/notice";
import { listQuery } from "@/lib/query";
import { deleteObjects, imageKeysIn } from "@/lib/s3";
import type { AttachmentInput } from "@/lib/upload";

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/notice");
}

function isAttachment(value: unknown): value is AttachmentInput {
  const file = value as AttachmentInput;

  return (
    typeof file?.fileName === "string" &&
    typeof file?.size === "number" &&
    typeof file?.s3Key === "string" &&
    /^files\/[0-9a-f-]+\.[a-z0-9]+$/.test(file.s3Key)
  );
}

function parseAttachments(value: FormDataEntryValue | null) {
  const parsed: unknown = JSON.parse(String(value ?? "[]"));
  return Array.isArray(parsed) ? parsed.filter(isAttachment) : [];
}

export async function saveNotice(id: number | null, page: number, _: string | null, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const contentHtml = cleanHtml(String(formData.get("contentHtml") ?? ""));
  const contentText = toPlainText(contentHtml);
  const files = parseAttachments(formData.get("attachments"));

  if (!title) return "제목을 입력해주세요.";
  if (!contentText && !contentHtml.includes("<img")) return "본문을 입력해주세요.";

  const values = { title, contentHtml, contentText };
  const previousHtml = id ? getNotice(id)?.contentHtml ?? "" : "";

  const removedFileKeys = db.transaction((tx) => {
    const noticeId = id ?? tx.insert(notices).values(values).returning({ id: notices.id }).get().id;

    if (id) tx.update(notices).set(values).where(eq(notices.id, id)).run();

    const current = tx.select().from(attachments).where(eq(attachments.noticeId, noticeId)).all();
    const currentKeys = new Set(current.map((file) => file.s3Key));
    const nextKeys = new Set(files.map((file) => file.s3Key));
    const removed = current.filter((file) => !nextKeys.has(file.s3Key));

    for (const file of removed) {
      tx.delete(attachments).where(eq(attachments.id, file.id)).run();
    }

    for (const { fileName, s3Key, size } of files) {
      if (!currentKeys.has(s3Key)) tx.insert(attachments).values({ noticeId, fileName, s3Key, size }).run();
    }

    return removed.map((file) => file.s3Key);
  });

  const nextImages = new Set(imageKeysIn(contentHtml));
  const removedImageKeys = imageKeysIn(previousHtml).filter((key) => !nextImages.has(key));

  await deleteObjects([...removedFileKeys, ...removedImageKeys]);

  if (id) revalidatePath(`/notice/${id}`);
  refreshPages();
  redirect(`/admin/notice${listQuery(undefined, page)}`);
}

export async function deleteNotice(id: number) {
  await requireAdmin();

  const notice = getNotice(id);
  if (!notice) return;

  const fileKeys = getAttachments(id).map((file) => file.s3Key);

  db.delete(notices).where(eq(notices.id, id)).run();
  await deleteObjects([...fileKeys, ...imageKeysIn(notice.contentHtml)]);

  revalidatePath(`/notice/${id}`);
  refreshPages();
}
