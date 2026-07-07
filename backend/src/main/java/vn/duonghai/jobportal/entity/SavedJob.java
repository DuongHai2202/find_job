package vn.duonghai.jobportal.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/** Cong viec ung vien luu lai (yeu thich). Thoi diem luu = createdAt. */
@Entity
@Table(
        name = "saved_jobs",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_saved_candidate_job",
                columnNames = {"candidate_id", "job_post_id"}
        )
)
@Getter
@Setter
public class SavedJob extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;
}
