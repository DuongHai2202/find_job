CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE candidates (
    user_id BIGINT PRIMARY KEY,
    date_of_birth DATE,
    gender VARCHAR(10),
    address VARCHAR(255),
    headline VARCHAR(255),
    summary TEXT,
    CONSTRAINT fk_candidates_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE employers (
    user_id BIGINT PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    company_description TEXT,
    tax_code VARCHAR(50),
    logo_url VARCHAR(500),
    website VARCHAR(255),
    company_size VARCHAR(50),
    address VARCHAR(255),
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_employers_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    parent_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories (id)
);

CREATE TABLE job_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employer_id BIGINT NOT NULL,
    category_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    location VARCHAR(255),
    job_type VARCHAR(30),
    level VARCHAR(30),
    status VARCHAR(30) NOT NULL,
    deadline DATE,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_job_posts_employer FOREIGN KEY (employer_id) REFERENCES employers (user_id),
    CONSTRAINT fk_job_posts_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    title VARCHAR(255),
    file_url VARCHAR(500),
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_resumes_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (user_id)
);

CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_post_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    resume_id BIGINT,
    cover_letter TEXT,
    note TEXT,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_applications_job_post FOREIGN KEY (job_post_id) REFERENCES job_posts (id),
    CONSTRAINT fk_applications_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (user_id),
    CONSTRAINT fk_applications_resume FOREIGN KEY (resume_id) REFERENCES resumes (id),
    CONSTRAINT uk_application_job_candidate UNIQUE (job_post_id, candidate_id)
);

CREATE TABLE saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    job_post_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_saved_jobs_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (user_id),
    CONSTRAINT fk_saved_jobs_job_post FOREIGN KEY (job_post_id) REFERENCES job_posts (id),
    CONSTRAINT uk_saved_candidate_job UNIQUE (candidate_id, job_post_id)
);

CREATE TABLE company_follows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    employer_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_company_follows_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (user_id),
    CONSTRAINT fk_company_follows_employer FOREIGN KEY (employer_id) REFERENCES employers (user_id),
    CONSTRAINT uk_follow_candidate_employer UNIQUE (candidate_id, employer_id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(40),
    title VARCHAR(255),
    content TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_users_role_status ON users (role, status);
CREATE INDEX idx_categories_parent_id ON categories (parent_id);
CREATE INDEX idx_job_posts_status ON job_posts (status);
CREATE INDEX idx_job_posts_employer_id ON job_posts (employer_id);
CREATE INDEX idx_job_posts_category_id ON job_posts (category_id);
CREATE INDEX idx_applications_candidate_id ON applications (candidate_id);
CREATE INDEX idx_applications_job_post_id ON applications (job_post_id);
CREATE INDEX idx_notifications_user_read ON notifications (user_id, is_read);
