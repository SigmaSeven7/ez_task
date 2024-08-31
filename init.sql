-- CREATE DATABASE IF NOT EXISTS excel_upload_tasks;

-- USE excel_upload_tasks;

-- CREATE TABLE IF NOT EXISTS users
-- (

--     u_id    INT AUTO_INCREMENT PRIMARY KEY,

--     u_name  VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS files
-- (

--     f_id    INT AUTO_INCREMENT PRIMARY KEY
-- );

-- CREATE TABLE IF NOT EXISTS customers
-- (

--     c_id         INT AUTO_INCREMENT PRIMARY KEY,

--     c_name       VARCHAR(255) NOT NULL,

--     c_email      VARCHAR(255) NOT NULL,

--     c_israeli_id VARCHAR(255) NOT NULL,

--     c_phone      VARCHAR(255) NOT NULL,

--     f_id         INT,

--     FOREIGN KEY (f_id) REFERENCES files (f_id) ON DELETE CASCADE
-- );

-- -- Inserting 5 fake users into the 'users' table with UUID tokens
-- INSERT INTO users (u_name)
-- VALUES ('John Doe'),
--        ('Jane Smith'),
--        ('Alice Johnson'),
--        ('Bob Brown'),
--        ('Charlie Davis');


-- CREATE DATABASE IF NOT EXISTS excel_upload_tasks;
-- USE excel_upload_tasks;

-- CREATE TABLE IF NOT EXISTS users (
--     u_id INT AUTO_INCREMENT PRIMARY KEY,
--     u_name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS files (
--     f_id INT AUTO_INCREMENT PRIMARY KEY,
--     filename VARCHAR(255) NOT NULL,
--     file_path VARCHAR(255) NOT NULL,
--     upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     u_id INT,
--     FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS customers (
--     c_id INT AUTO_INCREMENT PRIMARY KEY,
--     c_name VARCHAR(255) NOT NULL,
--     c_email VARCHAR(255) NOT NULL,
--     c_israeli_id VARCHAR(255) NOT NULL,
--     c_phone VARCHAR(255) NOT NULL,
--     f_id INT,
--     FOREIGN KEY (f_id) REFERENCES files(f_id) ON DELETE CASCADE
-- );

-- -- Add foreign key to files table after customers table is created
-- -- ALTER TABLE files
-- -- ADD CONSTRAINT fk_file_customer
-- -- FOREIGN KEY (c_id) REFERENCES customers(c_id) ON DELETE SET NULL;

-- -- Inserting 5 fake users into the 'users' table
-- INSERT INTO users (u_name) VALUES 
-- ('John Doe'), ('Jane Smith'), ('Alice Johnson'), ('Bob Brown'), ('Charlie Davis');

CREATE DATABASE IF NOT EXISTS excel_upload_tasks;
USE excel_upload_tasks;

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    u_id INT AUTO_INCREMENT PRIMARY KEY,
    u_name VARCHAR(255) NOT NULL
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
    f_id INT AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    f_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(u_id) ON DELETE CASCADE
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    c_id INT AUTO_INCREMENT PRIMARY KEY,
    c_name VARCHAR(255) NOT NULL,
    c_email VARCHAR(255) NOT NULL,
    c_israeli_id VARCHAR(255) NOT NULL,
    c_phone VARCHAR(255) NOT NULL,
    f_id INT,
    FOREIGN KEY (f_id) REFERENCES files(f_id) ON DELETE CASCADE
);

-- Insert example users
INSERT INTO users (u_name) VALUES 
('John Doe'),
('Jane Smith'),
('Alice Johnson'),
('Bob Brown'),
('Charlie Davis');