package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;

import java.time.Instant;

public record AdminUserResponse(
        Long id,
        String email,
        String fullName,
        String phone,
        Role role,
        UserStatus status,
        Instant createdAt
) {

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}