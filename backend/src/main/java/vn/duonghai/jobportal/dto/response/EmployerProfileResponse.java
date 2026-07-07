package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.enums.UserStatus;

public record EmployerProfileResponse(
        Long userId,
        String email,
        String fullName,
        String phone,
        UserStatus status,
        boolean approved,
        String companyName,
        String companyDescription,
        String taxCode,
        String logoUrl,
        String website,
        String companySize,
        String address
) {

    public static EmployerProfileResponse from(Employer employer) {
        return new EmployerProfileResponse(
                employer.getUserId(),
                employer.getUser().getEmail(),
                employer.getUser().getFullName(),
                employer.getUser().getPhone(),
                employer.getUser().getStatus(),
                employer.isApproved(),
                employer.getCompanyName(),
                employer.getCompanyDescription(),
                employer.getTaxCode(),
                employer.getLogoUrl(),
                employer.getWebsite(),
                employer.getCompanySize(),
                employer.getAddress()
        );
    }
}
