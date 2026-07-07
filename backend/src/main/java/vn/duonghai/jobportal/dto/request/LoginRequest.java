package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Email khong duoc de trong")
        @Email(message = "Email khong dung dinh dang")
        String email,

        @NotBlank(message = "Mat khau khong duoc de trong")
        @Size(min = 6, max = 100, message = "Mat khau phai tu 6 den 100 ky tu")
        String password
) {
}
