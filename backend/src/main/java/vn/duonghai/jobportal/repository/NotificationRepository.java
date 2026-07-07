package vn.duonghai.jobportal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.Notification;

import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Notification> findByIdAndUser_Id(Long id, Long userId);

    long countByUser_IdAndReadIsFalse(Long userId);
}