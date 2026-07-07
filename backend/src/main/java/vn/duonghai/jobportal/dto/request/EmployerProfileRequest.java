package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmployerProfileRequest(
        @Size(max = 150, message = "Ho ten nguoi dai dien toi da 150 ky tu")
        String fullName,

        @Size(max = 20, message = "So dien thoai toi da 20 ky tu")
        String phone,

        @NotBlank(message = "Ten cong ty khong duoc de trong")
        @Size(max = 200, message = "Ten cong ty toi da 200 ky tu")
        String companyName,

        @Size(max = 5000, message = "Mo ta cong ty toi da 5000 ky tu")
        String companyDescription,

        @Size(max = 50, message = "Ma so thue toi da 50 ky tu")
        String taxCode,

        @Size(max = 500, message = "Link logo toi da 500 ky tu")
        String logoUrl,

        @Size(max = 255, message = "Website toi da 255 ky tu")
        String website,

        @Size(max = 50, message = "Quy mo cong ty toi da 50 ky tu")
        String companySize,

        @Size(max = 255, message = "Dia chi toi da 255 ky tu")
        String address
) {
}
