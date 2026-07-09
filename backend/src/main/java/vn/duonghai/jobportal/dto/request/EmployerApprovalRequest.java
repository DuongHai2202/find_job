package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotNull;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;

public record EmployerApprovalRequest(
        @NotNull EmployerReviewStatus status
) {
}
