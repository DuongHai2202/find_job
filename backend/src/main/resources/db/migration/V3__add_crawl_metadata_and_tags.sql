ALTER TABLE employers ADD COLUMN source_url VARCHAR(500);

ALTER TABLE job_posts ADD COLUMN benefits TEXT;
ALTER TABLE job_posts ADD COLUMN source_url VARCHAR(500);

CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    normalized_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uk_tags_normalized_name UNIQUE (normalized_name)
);

CREATE TABLE job_post_tags (
    job_post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (job_post_id, tag_id),
    CONSTRAINT fk_job_post_tags_job_post FOREIGN KEY (job_post_id) REFERENCES job_posts (id),
    CONSTRAINT fk_job_post_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (id)
);

CREATE UNIQUE INDEX uk_employers_source_url ON employers (source_url);
CREATE UNIQUE INDEX uk_job_posts_source_url ON job_posts (source_url);
CREATE INDEX idx_job_post_tags_tag_id ON job_post_tags (tag_id);
