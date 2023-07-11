CREATE TABLE `stocks_data` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`symbol` text,
	`currency` text,
	`exchange` text,
	`mic` text,
	`date` date,
	`open` decimal,
	`high` decimal,
	`low` decimal,
	`close` decimal,
	`volume` int);
--> statement-breakpoint
CREATE TABLE `stocks_info` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`symbol` text,
	`name` text,
	`currency` text,
	`exchange` text,
	`mic_code` text,
	`country` text,
	`type` text);
