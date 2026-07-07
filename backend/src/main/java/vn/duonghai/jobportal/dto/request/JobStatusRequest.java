package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotNull;
import vn.duonghai.jobportal.enums.JobStatus;

public record JobStatusRequest(
        @NotNull(message = "Trang thai tin khong duoc de trong")
        JobStatus status
) {
}
