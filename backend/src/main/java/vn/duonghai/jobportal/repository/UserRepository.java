package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.duonghai.jobportal.entity.User;

import java.util.Optional;

/** DAO cho tai khoan nguoi dung. */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleSubject(String googleSubject);

    boolean existsByEmail(String email);
}
