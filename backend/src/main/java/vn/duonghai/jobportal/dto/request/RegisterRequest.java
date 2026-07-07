package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import vn.duonghai.jobportal.enums.Role;

public record RegisterRequest(
        @NotBlank(message = "Email khong duoc de trong")
        @Email(message = "Email khong dung dinh dang")
        String email,

        @NotBlank(message = "Mat khau khong duoc de trong")
        @Size(min = 6, max = 100, message = "Mat khau phai tu 6 den 100 ky tu")
        String password,

        @NotBlank(message = "Ho ten khong duoc de trong")
        @Size(max = 150, message = "Ho ten toi da 150 ky tu")
        String fullName,

        @Size(max = 20, message = "So dien thoai toi da 20 ky tu")
        String phone,

        @NotNull(message = "Vai tro khong duoc de trong")
        Role role,

        @Size(max = 200, message = "Ten cong ty toi da 200 ky tu")
        String companyName
) {
}
