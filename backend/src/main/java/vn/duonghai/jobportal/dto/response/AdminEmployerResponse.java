package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;
import vn.duonghai.jobportal.enums.UserStatus;

import java.time.Instant;

public record AdminEmployerResponse(
        Long id,
        String email,
        String fullName,
        UserStatus userStatus,
        EmployerReviewStatus reviewStatus,
        boolean approved,
        String companyName,
        String companySize,
        String address,
        Instant createdAt
) {

    public static AdminEmployerResponse from(Employer employer) {
        return new AdminEmployerResponse(
                employer.getUserId(),
                employer.getUser().getEmail(),
                employer.getUser().getFullName(),
                employer.getUser().getStatus(),
                employer.getReviewStatus(),
                employer.isApproved(),
                employer.getCompanyName(),
                employer.getCompanySize(),
                employer.getAddress(),
                employer.getUser().getCreatedAt()
        );
    }
}
