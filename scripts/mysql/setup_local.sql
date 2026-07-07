CREATE DATABASE IF NOT EXISTS job_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'jobportal'@'localhost' IDENTIFIED BY 'jobportal';
GRANT ALL PRIVILEGES ON job_portal.* TO 'jobportal'@'localhost';
FLUSH PRIVILEGES;

-- Suggested local app settings:
-- DB_URL=jdbc:mysql://localhost:3306/job_portal?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
-- DB_USERNAME=jobportal
-- DB_PASSWORD=jobportal
