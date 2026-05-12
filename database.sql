-- InMarc Indonesia Database Schema

CREATE DATABASE IF NOT EXISTS inmarc_db;
USE inmarc_db;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('Industrial', 'Office', 'Retail') NOT NULL,
    description TEXT NOT NULL,
    clientName VARCHAR(255) NOT NULL,
    projectDate DATE NOT NULL,
    status ENUM('Published', 'Draft') DEFAULT 'Draft',
    featuredImage LONGTEXT, -- Stores Base64 or Image Path
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    workEmail VARCHAR(255) NOT NULL,
    serviceRequired VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Seed Admin User (password: admin123)
-- In production, use password_hash()
INSERT INTO admin_users (username, password, name, email) 
VALUES ('admin', 'admin123', 'Admin User', 'admin@inmarc.id')
ON DUPLICATE KEY UPDATE username=username;
