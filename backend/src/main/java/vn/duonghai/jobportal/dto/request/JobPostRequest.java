package vn.duonghai.jobportal.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record JobPostRequest(
        @NotBlank(message = "Tieu de cong viec khong duoc de trong")
        @Size(max = 255, message = "Tieu de toi da 255 ky tu")
        String title,

        @Size(max = 10000, message = "Mo ta cong viec qua dai")
        String description,

        @Size(max = 10000, message = "Yeu cau cong viec qua dai")
        String requirements,

        @Size(max = 10000, message = "Quyen loi cong viec qua dai")
        String benefits,

        @DecimalMin(value = "0", message = "Luong toi thieu phai >= 0")
        BigDecimal salaryMin,

        @DecimalMin(value = "0", message = "Luong toi da phai >= 0")
        BigDecimal salaryMax,

        @Size(max = 255, message = "Dia diem toi da 255 ky tu")
        String location,

        @NotNull(message = "Hinh thuc lam viec khong duoc de trong")
        JobType jobType,

        @NotNull(message = "Cap bac khong duoc de trong")
        JobLevel level,

        Long categoryId,

        @FutureOrPresent(message = "Han nop phai la hom nay hoac trong tuong lai")
        LocalDate deadline
) {
}
