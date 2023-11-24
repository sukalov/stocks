CREATE TABLE `adjustments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`index` text NOT NULL,
	`capitalizations` json NOT NULL,
	`original_percents` json NOT NULL,
	`percents` json NOT NULL,
	`is_quartile` boolean,
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
CREATE TABLE `dividents` (
	`date` date NOT NULL,
	`dividents` json NOT NULL
);
--> statement-breakpoint
CREATE TABLE `indexnames` (
	`id` varchar(20) NOT NULL,
	CONSTRAINT `indexnames_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indexprices` (
	`type` varchar(20),
	`json` json
);
--> statement-breakpoint
CREATE TABLE `indicies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`name` text NOT NULL,
	`adjustment` date,
	`index` float,
	`total_return` float,
	CONSTRAINT `indicies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stocks_info` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`name` text,
	`currency` text,
	`country` text,
	`shares` bigint,
	`market_cap` bigint,
	`last_price` float,
	`cap_index` text,
	`indicies` json,
	`is_delisted` boolean,
	CONSTRAINT `stocks_info_symbol` PRIMARY KEY(`symbol`),
	CONSTRAINT `stocks_info_id_unique` UNIQUE(`id`)
);
