package vn.duonghai.jobportal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;

import java.util.List;
import java.util.Optional;

/** DAO cho ho so ung tuyen. */
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByJobPostAndCandidate(JobPost jobPost, Candidate candidate);

    boolean existsByResume_Id(Long resumeId);

    boolean existsByResume_IdAndJobPost_Employer_UserId(Long resumeId, Long employerUserId);

    @Override
    @EntityGraph(attributePaths = {"jobPost", "jobPost.employer", "jobPost.employer.user", "candidate", "candidate.user", "resume"})
    Optional<Application> findById(Long id);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.employer", "jobPost.employer.user", "resume"})
    Page<Application> findByCandidate_UserId(Long candidateUserId, Pageable pageable);

    @EntityGraph(attributePaths = {"jobPost", "candidate", "candidate.user", "resume"})
    Page<Application> findByJobPost_Employer_UserId(Long employerUserId, Pageable pageable);

    @EntityGraph(attributePaths = {"jobPost", "candidate", "candidate.user", "resume"})
    Page<Application> findByJobPost_Employer_UserIdAndJobPost_Id(Long employerUserId, Long jobPostId, Pageable pageable);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.employer", "jobPost.employer.user", "jobPost.category", "resume"})
    List<Application> findTop20ByCandidate_UserIdOrderByCreatedAtDesc(Long candidateUserId);

    long countByJobPost(JobPost jobPost);
}
