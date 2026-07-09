package vn.duonghai.jobportal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;

import java.util.Optional;

/** DAO cho ho so doanh nghiep (khoa chinh = user_id). */
public interface EmployerRepository extends JpaRepository<Employer, Long> {

    Page<Employer> findByReviewStatus(EmployerReviewStatus reviewStatus, Pageable pageable);

    Optional<Employer> findBySourceUrl(String sourceUrl);

    Optional<Employer> findByCompanyNameIgnoreCaseAndAddressIgnoreCase(String companyName, String address);

    @Override
    @EntityGraph(attributePaths = {"user"})
    Optional<Employer> findById(Long id);
}
