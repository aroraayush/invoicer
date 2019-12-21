CREATE TABLE `user_type` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                             `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                             `name` varchar(45) NOT NULL,
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `name` (`name`),
                             KEY `ix_user_type_created_on` (`created_on`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `user` (
                        `id` int(11) NOT NULL AUTO_INCREMENT,
                        `mobile` bigint(20) NOT NULL,
                        `password` varchar(255) DEFAULT NULL,
                        `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                        `email` varchar(125) DEFAULT NULL,
                        `name` varchar(127) DEFAULT NULL,
                        `type_id` int(11) NOT NULL,
                        `company_name` varchar(45) DEFAULT NULL,
                        `company_website` varchar(245) DEFAULT NULL,
                        `auth_token` text,
                        `expiry_time` datetime DEFAULT NULL,
                        `company_address` varchar(255) NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `mobile_UNIQUE` (`mobile`),
                        KEY `ix_user_created_on` (`created_on`),
                        KEY `ix_user_id` (`id`),
                        KEY `fk_type_id_idx` (`type_id`),
                        CONSTRAINT `fk_type_id` FOREIGN KEY (`type_id`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `name` varchar(45) NOT NULL,
                           `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                           `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                           `sku` varchar(99) NOT NULL COMMENT 'Stock Keeping Unit Number',
                           `label` varchar(145) DEFAULT NULL,
                           `rate` decimal(6,2) NOT NULL,
                           `description` varchar(255) DEFAULT NULL,
                           `user_id` int(11) DEFAULT NULL,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `uq_sku_user_id` (`sku`),
                           KEY `idx_sku` (`sku`),
                           KEY `fk_user_id_idx` (`user_id`),
                           CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `customer` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                            `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                            `name` varchar(127) DEFAULT NULL,
                            `mobile` bigint(20) DEFAULT NULL,
                            `email` varchar(127) NOT NULL,
                            `user_id` int(11) NOT NULL,
                            `company_name` varchar(99) DEFAULT NULL,
                            `type_id` int(11) DEFAULT NULL,
                            `tin_no` varchar(9) NOT NULL,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uq_email_user_id` (`email`,`user_id`),
                            KEY `fk_user_idx` (`user_id`),
                            KEY `fk_type_idx` (`type_id`),
                            CONSTRAINT `fk_type` FOREIGN KEY (`type_id`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
                            CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `invoice` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `inv_number` varchar(45) NOT NULL,
                           `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                           `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                           `user_id` int(11) NOT NULL,
                           `customer_id` int(11) NOT NULL,
                           `inv_date` date NOT NULL,
                           `due_date` date NOT NULL,
                           `total_amt` decimal(10,2) NOT NULL,
                           `due_amt` decimal(10,2) NOT NULL,
                           `tax_val` decimal(5,2) DEFAULT NULL,
                           `discount` decimal(5,2) DEFAULT NULL,
                           `shipping_charge` decimal(10,2) DEFAULT NULL,
                           `prepaid_amt` decimal(10,2) DEFAULT NULL,
                           `notes` text,
                           `terms` text,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `uq_inv_num_user_id` (`inv_number`,`user_id`),
                           KEY `fk_customer_idx` (`customer_id`),
                           KEY `fk_usr_idx` (`user_id`),
                           CONSTRAINT `fk_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
                           CONSTRAINT `fk_usr` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `invoice_product` (
                                   `id` int(11) NOT NULL AUTO_INCREMENT,
                                   `invoice_id` int(11) NOT NULL,
                                   `product_id` int(11) NOT NULL,
                                   `quantity` int(11) NOT NULL,
                                   `rate` decimal(10,2) NOT NULL,
                                   PRIMARY KEY (`id`),
                                   UNIQUE KEY `uq_inv_id_prod_id` (`invoice_id`,`product_id`),
                                   KEY `fk_product_id_idx` (`product_id`),
                                   KEY `fk_invoice_id_idx` (`invoice_id`),
                                   CONSTRAINT `fk_invoice_id` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
                                   CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
