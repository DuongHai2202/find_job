package vn.duonghai.jobportal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.CompanyFollow;
import vn.duonghai.jobportal.entity.Employer;

import java.util.List;

public interface CompanyFollowRepository extends JpaRepository<CompanyFollow, Long> {

    boolean existsByCandidateAndEmployer(Candidate candidate, Employer employer);

    long deleteByCandidateAndEmployer(Candidate candidate, Employer employer);

    @EntityGraph(attributePaths = {"employer", "employer.user"})
    Page<CompanyFollow> findByCandidate_UserId(Long candidateUserId, Pageable pageable);

    @EntityGraph(attributePaths = {"candidate", "candidate.user"})
    List<CompanyFollow> findByEmployer(Employer employer);
}
