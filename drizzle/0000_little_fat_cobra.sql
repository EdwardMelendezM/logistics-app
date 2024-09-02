CREATE TABLE `requirement_details` (
	`id` varchar(36) NOT NULL,
	`requirement_id` varchar(36) NOT NULL,
	`description` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`deleted_at` timestamp,
	CONSTRAINT `requirement_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `requirements` (
	`id` varchar(36) NOT NULL,
	`description` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`priority` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`deleted_at` timestamp,
	CONSTRAINT `requirements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `requirement_details` ADD CONSTRAINT `requirement_details_requirement_id_requirements_id_fk` FOREIGN KEY (`requirement_id`) REFERENCES `requirements`(`id`) ON DELETE no action ON UPDATE no action;