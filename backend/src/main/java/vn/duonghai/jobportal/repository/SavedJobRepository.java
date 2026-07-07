package vn.duonghai.jobportal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.SavedJob;

import java.util.List;

/** DAO cho cong viec da luu. */
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    boolean existsByCandidateAndJobPost(Candidate candidate, JobPost jobPost);

    void deleteByCandidateAndJobPost(Candidate candidate, JobPost jobPost);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.employer", "jobPost.employer.user", "jobPost.category"})
    Page<SavedJob> findByCandidate(Candidate candidate, Pageable pageable);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.employer", "jobPost.employer.user", "jobPost.category"})
    List<SavedJob> findTop20ByCandidate_UserIdOrderByCreatedAtDesc(Long candidateUserId);
}
