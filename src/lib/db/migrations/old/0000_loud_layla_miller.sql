CREATE TABLE `adjustments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`index` text NOT NULL,
	`capitalizations` json NOT NULL,
	`original_percents` json NOT NULL,
	`percents` json NOT NULL,
	CONSTRAINT `adjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`date` date NOT NULL,
	`KRW` float,
	`JPY` float,
	`TWD` float,
	CONSTRAINT `currencies_date` PRIMARY KEY(`date`)
);
--> statement-breakpoint
CREATE TABLE `stocks_info` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`name` text,
	`currency` text,
	`country` text,
	`shares` bigint,
	`cap_index` text,
	`indicies` json,
	CONSTRAINT `stocks_info_symbol` PRIMARY KEY(`symbol`),
	CONSTRAINT `stocks_info_id_unique` UNIQUE(`id`)
);
