-- V2__seed_data.sql
-- Seed admin user (password: admin123)

INSERT INTO users (email, name, initials, role, password_hash)
VALUES ('admin@msfgco.com', 'Admin User', 'AU', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
