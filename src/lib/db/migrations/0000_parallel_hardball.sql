CREATE TABLE `stocks_info` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`symbol` text,
	`name` text,
	`currency` text,
	`country` text,
	`shares` int,
	`cap_index` text,
	`indicies` json,
	CONSTRAINT `stocks_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stocks_prices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`symbol` text,
	`currency` text,
	`date` date,
	`close` decimal,
	CONSTRAINT `stocks_prices_id` PRIMARY KEY(`id`)
);
