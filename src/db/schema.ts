import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const now = sql`(datetime('now', '+9 hours'))`;

export const schedules = sqliteTable("schedule", {
  date: text("date").primaryKey(),
  content: text("content").notNull(),
});

export const notices = sqliteTable("notices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  contentHtml: text("content_html").notNull(),
  createdAt: text("created_at").notNull().default(now),
});

export const attachments = sqliteTable("attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  noticeId: integer("notice_id")
    .notNull()
    .references(() => notices.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  s3Key: text("s3_key").notNull(),
  size: integer("size").notNull(),
});
