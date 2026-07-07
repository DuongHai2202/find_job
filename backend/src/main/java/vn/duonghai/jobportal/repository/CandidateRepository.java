package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Candidate;

import java.util.Optional;

/** DAO cho ho so ung vien (khoa chinh = user_id). */
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    @Override
    @EntityGraph(attributePaths = {"user"})
    Optional<Candidate> findById(Long id);
}
