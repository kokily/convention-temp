import "server-only";
import { count, desc, eq, gt, asc, like, lt, or } from "drizzle-orm";
import { db } from "@/db";
import { attachments, notices } from "@/db/schema";

export const PAGE_SIZE = 10;

export function listNotices(q: string, requestedPage: number) {
  const where = q ? or(like(notices.title, `%${q}%`), like(notices.contentText, `%${q}%`)) : undefined;

  const total = db.select({ value: count() }).from(notices).where(where).get()?.value ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, lastPage);

  const rows = db
    .select({ id: notices.id, title: notices.title, createdAt: notices.createdAt })
    .from(notices)
    .where(where)
    .orderBy(desc(notices.id))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)
    .all();

  return { rows, total, page, lastPage };
}

export function getNotice(id: number) {
  return db.select().from(notices).where(eq(notices.id, id)).get();
}

export function getAdjacent(id: number) {
  const columns = { id: notices.id, title: notices.title };

  return {
    prev: db.select(columns).from(notices).where(lt(notices.id, id)).orderBy(desc(notices.id)).limit(1).get(),
    next: db.select(columns).from(notices).where(gt(notices.id, id)).orderBy(asc(notices.id)).limit(1).get(),
  };
}

export function getAttachments(noticeId: number) {
  return db.select().from(attachments).where(eq(attachments.noticeId, noticeId)).orderBy(asc(attachments.id)).all();
}

export function getAttachment(id: number) {
  return db.select().from(attachments).where(eq(attachments.id, id)).get();
}
