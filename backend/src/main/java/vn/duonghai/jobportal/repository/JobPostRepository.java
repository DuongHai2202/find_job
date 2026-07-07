package vn.duonghai.jobportal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.enums.JobStatus;

import java.time.LocalDate;
import java.util.Optional;

/**
 * DAO cho tin tuyen dung.
 * - {@link JpaSpecificationExecutor} ho tro tim kiem/loc dong.
 * - {@code @EntityGraph} nap kem employer/category tranh N+1.
 */
public interface JobPostRepository
        extends JpaRepository<JobPost, Long>, JpaSpecificationExecutor<JobPost> {

    @Override
    @EntityGraph(attributePaths = {"employer", "employer.user", "category", "tags"})
    Optional<JobPost> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"employer", "employer.user", "category", "tags"})
    Page<JobPost> findAll(Specification<JobPost> specification, Pageable pageable);

    @EntityGraph(attributePaths = {"employer", "employer.user", "category", "tags"})
    Page<JobPost> findByEmployer_UserId(Long employerUserId, Pageable pageable);

    @EntityGraph(attributePaths = {"employer", "employer.user", "category", "tags"})
    Page<JobPost> findByStatus(JobStatus status, Pageable pageable);

    Optional<JobPost> findBySourceUrl(String sourceUrl);

    Optional<JobPost> findByEmployer_UserIdAndTitleIgnoreCaseAndLocationIgnoreCaseAndDeadline(
            Long employerUserId,
            String title,
            String location,
            LocalDate deadline
    );

    boolean existsByCategory_Id(Long categoryId);

    long countByStatus(JobStatus status);
}
