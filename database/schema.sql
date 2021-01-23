CREATE DATABASE IF NOT EXISTS affiliate_blog_db;

ALTER DATABASE affiliate_blog_db CHARACTER SET utf32 COLLATE utf32_general_ci;

USE affiliate_blog_db;

CREATE TABLE IF NOT EXISTS roles (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `created` DATETIME DEFAULT NULL,
  `updated` DATETIME DEFAULT NULL,
  `deleted` DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS users (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `role_id` VARCHAR(64) NULL,
  `first_name` VARCHAR(50)  NOT NULL,
  `last_name` VARCHAR(50)  NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50)  NOT NULL,
  `password` VARCHAR(64)  NOT NULL,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` LONGTEXT NOT NULL,
  `excerpt`  LONGTEXT NOT NULL,
  `image` LONGTEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `author_id` VARCHAR(64) NOT NULL,
  `isFeatured` BOOLEAN DEFAULT false,
  `isAvailable` BOOLEAN DEFAULT false,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);

CREATE TABLE IF NOT EXISTS images (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `image` LONGTEXT NOT NULL,
  `showcase` BOOLEAN DEFAULT true,
  `created` DATETIME  NULL,
  `updated` DATETIME  NULL,
  `deleted` DATETIME  NULL
);

