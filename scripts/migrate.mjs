import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database(process.env.DATABASE_PATH ?? "./data/app.db");
migrate(drizzle(sqlite), { migrationsFolder: "./drizzle" });
sqlite.close();
console.log("migration complete");
