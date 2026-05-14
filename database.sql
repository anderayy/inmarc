-- InMarc Indonesia Database Schema

CREATE DATABASE IF NOT EXISTS inmarc_db;
USE inmarc_db;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('Outsourcing', 'Events', 'Procurement', 'Transport', 'Logistics', 'Technical') NOT NULL,
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

-- Seed Admin User
INSERT INTO admin_users (username, password, name, email) 
VALUES ('admin', '$2y$10$vUaTP9aONwaUp592Rj3g7uxWDy7E8cnliqhLjStLop4bOhYaA9a0m', 'Admin User', 'admin@inmarc.id')
ON DUPLICATE KEY UPDATE username=username;

-- Seed Portfolio Highlights
INSERT INTO projects (title, category, description, clientName, projectDate, status) VALUES
('Sales Award Program', 'Events', 'Comprehensive event management for nationwide sales recognition.', 'Microsoft', '2023-12-01', 'Published'),
('Enterprise Technical Support', 'Technical', 'Authorized Fuji Xerox service operations and maintenance.', 'Fuji Xerox', '2024-01-15', 'Published'),
('Nationwide Logistics Execution', 'Logistics', 'End-to-end delivery coordination for enterprise-level campaigns.', 'Intel', '2023-11-20', 'Published'),
('Operational Manpower Outsourcing', 'Outsourcing', 'Strategic staffing and payroll management for tech headquarters.', 'HP', '2024-02-10', 'Published');
