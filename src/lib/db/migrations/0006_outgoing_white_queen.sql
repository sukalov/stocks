ALTER TABLE `indicies` ADD `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `indicies` DROP COLUMN `index_price`;--> statement-breakpoint
ALTER TABLE `indicies` ADD PRIMARY KEY(`id`);