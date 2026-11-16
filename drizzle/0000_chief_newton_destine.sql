CREATE TABLE `request_limits` (
	`user_id` text PRIMARY KEY NOT NULL,
	`window` integer NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`user_id` text NOT NULL,
	`symbol` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `symbol`)
);
