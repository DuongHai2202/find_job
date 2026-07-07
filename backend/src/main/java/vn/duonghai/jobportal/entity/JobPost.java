package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

/** Tin tuyen dung. Mot {@link Employer} dang nhieu JobPost (quan he 1-N). */
@Entity
@Table(name = "job_posts")
@Getter
@Setter
public class JobPost extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(length = 255)
    private String location;

    @Column(name = "source_url", length = 500, unique = true)
    private String sourceUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", length = 30)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private JobLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobStatus status = JobStatus.PENDING;

    private LocalDate deadline;

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "job_post_tags",
            joinColumns = @JoinColumn(name = "job_post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new LinkedHashSet<>();
}
