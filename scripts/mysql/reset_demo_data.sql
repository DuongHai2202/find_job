USE job_portal;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE company_follows;
TRUNCATE TABLE saved_jobs;
TRUNCATE TABLE applications;
TRUNCATE TABLE resumes;
TRUNCATE TABLE job_post_tags;
TRUNCATE TABLE tags;
TRUNCATE TABLE job_posts;
TRUNCATE TABLE employers;
TRUNCATE TABLE candidates;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Restart backend with APP_SEED=true to recreate fresh demo data.
