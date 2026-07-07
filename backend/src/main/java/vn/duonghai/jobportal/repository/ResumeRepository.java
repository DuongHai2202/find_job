package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Resume;

import java.util.List;
import java.util.Optional;

/** DAO cho ho so nang luc (CV). */
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    @EntityGraph(attributePaths = {"candidate", "candidate.user"})
    List<Resume> findByCandidate_UserIdOrderByCreatedAtDesc(Long candidateUserId);

    @EntityGraph(attributePaths = {"candidate", "candidate.user"})
    Optional<Resume> findByIdAndCandidate_UserId(Long id, Long candidateUserId);

    @Override
    @EntityGraph(attributePaths = {"candidate", "candidate.user"})
    Optional<Resume> findById(Long id);
}