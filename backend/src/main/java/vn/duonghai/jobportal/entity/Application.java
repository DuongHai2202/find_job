package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import vn.duonghai.jobportal.enums.ApplicationStatus;

/**
 * Ho so ung tuyen - lop trung gian noi {@link Candidate} va {@link JobPost}.
 * Rang buoc UNIQUE(job_post_id, candidate_id) de chong ung tuyen trung.
 * Thoi diem nop = createdAt (BaseEntity).
 */
@Entity
@Table(
        name = "applications",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_application_job_candidate",
                columnNames = {"job_post_id", "candidate_id"}
        )
)
@Getter
@Setter
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.PENDING;
}
