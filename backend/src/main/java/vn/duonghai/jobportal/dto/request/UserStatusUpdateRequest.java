package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotNull;
import vn.duonghai.jobportal.enums.UserStatus;

public record UserStatusUpdateRequest(
        @NotNull(message = "Trang thai tai khoan khong duoc de trong")
        UserStatus status
) {
}