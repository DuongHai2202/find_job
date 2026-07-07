package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Ho so nang luc (CV) cua ung vien. Mot Candidate co nhieu Resume (1-N). */
@Entity
@Table(name = "resumes")
@Getter
@Setter
public class Resume extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(length = 255)
    private String title;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "stored_file_name", length = 255)
    private String storedFileName;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "size_in_bytes")
    private Long sizeInBytes;

    @Column(name = "storage_provider", length = 30)
    private String storageProvider;

    @Column(columnDefinition = "TEXT")
    private String content;
}