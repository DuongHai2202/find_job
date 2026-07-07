package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResumeRequest(
        @NotBlank(message = "Tieu de CV khong duoc de trong")
        @Size(max = 255, message = "Tieu de CV toi da 255 ky tu")
        String title,

        @Size(max = 500, message = "Link file CV toi da 500 ky tu")
        String fileUrl,

        @Size(max = 10000, message = "Noi dung CV toi da 10000 ky tu")
        String content
) {
}
