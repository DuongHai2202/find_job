package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;

/**
 * Tai khoan nguoi dung (lop co so). Vai tro phan biet qua truong {@code role}.
 * Thong tin mo rong cho tung vai tro nam o {@link Candidate} / {@link Employer}.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "google_subject", unique = true, length = 255)
    private String googleSubject;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserStatus status = UserStatus.ACTIVE;
}
