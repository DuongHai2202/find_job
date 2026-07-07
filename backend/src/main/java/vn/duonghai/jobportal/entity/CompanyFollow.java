package vn.duonghai.jobportal.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * Ung vien theo doi cong ty - nguon du lieu cho Observer pattern.
 * Khi Employer dang tin moi, he thong thong bao den cac follower.
 */
@Entity
@Table(
        name = "company_follows",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_follow_candidate_employer",
                columnNames = {"candidate_id", "employer_id"}
        )
)
@Getter
@Setter
public class CompanyFollow extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;
}
