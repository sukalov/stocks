CREATE TABLE `stock` (
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
