package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.CompanyFollow;

import java.time.Instant;

public record CompanyFollowResponse(
        Long id,
        Long employerId,
        String companyName,
        boolean approved,
        Instant followedAt
) {

    public static CompanyFollowResponse from(CompanyFollow companyFollow) {
        return new CompanyFollowResponse(
                companyFollow.getId(),
                companyFollow.getEmployer().getUserId(),
                companyFollow.getEmployer().getCompanyName(),
                companyFollow.getEmployer().isApproved(),
                companyFollow.getCreatedAt()
        );
    }
}