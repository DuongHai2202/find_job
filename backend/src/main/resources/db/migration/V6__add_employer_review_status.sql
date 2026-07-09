ALTER TABLE employers
    ADD COLUMN review_status VARCHAR(20) NOT NULL DEFAULT 'PENDING';

UPDATE employers
SET review_status = CASE
    WHEN approved = TRUE THEN 'APPROVED'
    ELSE 'PENDING'
END;
