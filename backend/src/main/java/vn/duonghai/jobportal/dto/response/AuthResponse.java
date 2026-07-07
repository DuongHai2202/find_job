package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInMs,
        UserInfo user
) {

    public AuthResponse(String accessToken, long expiresInMs, UserInfo user) {
        this(accessToken, "Bearer", expiresInMs, user);
    }

    public record UserInfo(
            Long id,
            String email,
            String fullName,
            Role role,
            UserStatus status
    ) {
    }
}
