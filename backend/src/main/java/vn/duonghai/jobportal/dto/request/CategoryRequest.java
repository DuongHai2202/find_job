package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Ten danh muc khong duoc de trong")
        @Size(max = 150, message = "Ten danh muc toi da 150 ky tu")
        String name,

        Long parentId
) {
}
