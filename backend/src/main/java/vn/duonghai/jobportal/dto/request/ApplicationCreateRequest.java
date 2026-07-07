package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationCreateRequest(
        @NotNull(message = "Job id khong duoc de trong")
        Long jobId,

        Long resumeId,

        @Size(max = 5000, message = "Thu ung tuyen toi da 5000 ky tu")
        String coverLetter
) {
}
