ALTER TABLE `stocks_prices` MODIFY COLUMN `symbol` text NOT NULL;--> statement-breakpoint
ALTER TABLE `stocks_prices` ADD PRIMARY KEY(`symbol`);