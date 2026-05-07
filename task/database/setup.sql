-- MySQL Database Setup for Task Manager Application
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS taskmanager 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE taskmanager;

-- Create a dedicated user for the application (optional but recommended)
-- CREATE USER IF NOT EXISTS 'taskmanager_user'@'localhost' IDENTIFIED BY 'taskmanager_password';
-- GRANT ALL PRIVILEGES ON taskmanager.* TO 'taskmanager_user'@'localhost';
-- FLUSH PRIVILEGES;

-- The tables will be automatically created by Hibernate/JPA when the application starts
-- due to spring.jpa.hibernate.ddl-auto=update configuration

-- Expected tables that will be created:
-- 1. users (id, username, email, password, first_name, last_name, created_at, updated_at, last_login, is_active)
-- 2. tasks (id, title, description, status, priority, created_at, updated_at, due_date, user_id)

-- Verify database creation
SHOW DATABASES;
SHOW TABLES;
