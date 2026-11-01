"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { schedules } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

function assertDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("잘못된 날짜입니다");
}

function refreshPages() {
  revalidatePath("/schedule");
  revalidatePath("/admin/schedule");
}

export async function saveSchedule(date: string, content: string) {
  await requireAdmin();
  assertDate(date);

  const trimmed = content.trim();
  if (!trimmed) throw new Error("일정 내용을 입력해주세요");

  db.insert(schedules)
    .values({ date, content: trimmed })
    .onConflictDoUpdate({ target: schedules.date, set: { content: trimmed } })
    .run();

  refreshPages();
}

export async function deleteSchedule(date: string) {
  await requireAdmin();
  assertDate(date);

  db.delete(schedules).where(eq(schedules.date, date)).run();

  refreshPages();
}
