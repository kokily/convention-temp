"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { notices } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { cleanHtml, toPlainText } from "@/lib/html";
import { listQuery } from "@/lib/query";

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/notice");
}

export async function saveNotice(id: number | null, page: number, _: string | null, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const contentHtml = cleanHtml(String(formData.get("contentHtml") ?? ""));
  const contentText = toPlainText(contentHtml);

  if (!title) return "제목을 입력해주세요.";
  if (!contentText && !contentHtml.includes("<img")) return "본문을 입력해주세요.";

  const values = { title, contentHtml, contentText };

  if (id) {
    db.update(notices).set(values).where(eq(notices.id, id)).run();
    revalidatePath(`/notice/${id}`);
  } else {
    db.insert(notices).values(values).run();
  }

  refreshPages();
  redirect(`/admin/notice${listQuery(undefined, page)}`);
}

export async function deleteNotice(id: number) {
  await requireAdmin();

  db.delete(notices).where(eq(notices.id, id)).run();
  revalidatePath(`/notice/${id}`);
  refreshPages();
}
