USE `full-stack-ecommerce`;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `customer`;

CREATE TABLE IF NOT EXISTS `full-stack-ecommerce`.`customer`(
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) Not null,
    `email` varchar(255) Not null,
	primary key(`id`)
) Engine=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `address`;

create table if not exists `full-stack-ecommerce`.`address`(
	`id` bigint(20) not null auto_increment,
    `street` varchar(255) not null,
	`city` varchar(255) not null,
	`state` varchar(255) not null,
    `country` varchar(255) not null,
    `zip_code` varchar(255) not null,
	primary key(`id`)
)Engine=InnoDB auto_increment=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `orders`;

create table if not exists `full-stack-ecommerce`.`orders`(
	`id`  bigint(20) not null auto_increment,
    `order_tracking_number` varchar(255) unique not null,
    `total_price` decimal(19,2) not null,
    `total_quantity` int(11) not null,
    `status` varchar(255) not null,
    `date_created` datetime(6) default null,
    `last_updated` datetime(6) default null,
    `customer_id` bigint(20),
    `shipping_address_id` bigint(20),
	`billing_address_id` bigint(20),
    
    primary key(`id`),
    unique key `uk_billing_address_id` (`billing_address_id`),
	unique key `uk_shipping_address_id` (`shipping_address_id`),
    constraint `fk_customer_id` foreign key (`customer_id`) references `customer` (`id`),
    constraint `fk_shipping_address_id` foreign key (`shipping_address_id`) references `address` (`id`),
    constraint `fk_billing_address_id` foreign key (`billing_address_id`) references `address` (`id`)
    
)Engine=InnoDB auto_increment=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `order_item`;
create table if not exists `full-stack-ecommerce`.`order_item`(
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` decimal(19,2) DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FK_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;

