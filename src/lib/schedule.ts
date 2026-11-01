import "server-only";
import { like } from "drizzle-orm";
import { db } from "@/db";
import { schedules } from "@/db/schema";

export function getSchedules(month: string) {
  const rows = db
    .select()
    .from(schedules)
    .where(like(schedules.date, `${month}-%`))
    .all();

  return Object.fromEntries(rows.map((r) => [r.date, r.content]));
}
