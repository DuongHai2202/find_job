package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Category;

import java.util.Optional;

/** DAO cho nhom nganh nghe. */
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByParent_Id(Long parentId);
}
