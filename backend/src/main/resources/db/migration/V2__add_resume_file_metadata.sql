ALTER TABLE resumes ADD COLUMN original_file_name VARCHAR(255);
ALTER TABLE resumes ADD COLUMN stored_file_name VARCHAR(255);
ALTER TABLE resumes ADD COLUMN mime_type VARCHAR(100);
ALTER TABLE resumes ADD COLUMN size_in_bytes BIGINT;
ALTER TABLE resumes ADD COLUMN storage_provider VARCHAR(30);