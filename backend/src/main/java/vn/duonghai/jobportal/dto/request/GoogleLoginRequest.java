package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank(message = "Google ID token khong duoc de trong")
        String idToken
) {
}
