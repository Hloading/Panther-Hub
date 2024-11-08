CREATE DATABASE IF NOT EXISTS panther_hub;

USE panther_hub;

-- Users table for user authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255),
    description TEXT,
    attendees TEXT, -- Changed JSON to TEXT for compatibility
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing email in users for quick lookup
CREATE INDEX idx_users_email ON users (email);
