package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CandidateProfileRequest(
        @Size(max = 150, message = "Ho ten toi da 150 ky tu")
        String fullName,

        @Size(max = 20, message = "So dien thoai toi da 20 ky tu")
        String phone,

        LocalDate dateOfBirth,

        @Size(max = 10, message = "Gioi tinh toi da 10 ky tu")
        String gender,

        @Size(max = 255, message = "Dia chi toi da 255 ky tu")
        String address,

        @Size(max = 255, message = "Headline toi da 255 ky tu")
        String headline,

        @Size(max = 5000, message = "Tom tat toi da 5000 ky tu")
        String summary
) {
}
