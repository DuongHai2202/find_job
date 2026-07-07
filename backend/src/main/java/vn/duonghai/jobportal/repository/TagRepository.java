package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Tag;

import java.util.Optional;

/** DAO cho tag cua job post. */
public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByNormalizedName(String normalizedName);

    boolean existsByNormalizedName(String normalizedName);
}
