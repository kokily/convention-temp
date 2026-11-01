CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`notice_id` integer NOT NULL,
	`file_name` text NOT NULL,
	`s3_key` text NOT NULL,
	`size` integer NOT NULL,
	FOREIGN KEY (`notice_id`) REFERENCES `notices`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content_html` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', '+9 hours')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `schedule` (
	`date` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL
);
