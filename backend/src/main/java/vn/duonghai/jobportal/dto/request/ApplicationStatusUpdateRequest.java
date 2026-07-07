package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import vn.duonghai.jobportal.enums.ApplicationStatus;

public record ApplicationStatusUpdateRequest(
        @NotNull(message = "Trang thai ho so khong duoc de trong")
        ApplicationStatus status,

        @Size(max = 5000, message = "Ghi chu toi da 5000 ky tu")
        String note
) {
}
