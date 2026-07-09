package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;

import java.util.Optional;

/** DAO cho tai khoan nguoi dung. */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleSubject(String googleSubject);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    long countByRoleAndStatus(Role role, UserStatus status);
}
