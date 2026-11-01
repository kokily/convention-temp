import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

if (!process.env.DATABASE_PATH) throw new Error("DATABASE_PATH 가 필요합니다");

const sqlite = new Database(process.env.DATABASE_PATH);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
