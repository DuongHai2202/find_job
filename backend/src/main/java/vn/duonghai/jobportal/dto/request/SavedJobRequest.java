package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotNull;

public record SavedJobRequest(
        @NotNull(message = "Job id khong duoc de trong")
        Long jobId
) {
}
