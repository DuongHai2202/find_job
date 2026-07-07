package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record JobPostResponse(
        Long id,
        String title,
        String description,
        String requirements,
        String benefits,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String location,
        String sourceUrl,
        JobType jobType,
        JobLevel level,
        JobStatus status,
        LocalDate deadline,
        int viewCount,
        long applicationCount,
        List<String> tags,
        CategoryInfo category,
        EmployerInfo employer,
        Instant createdAt,
        Instant updatedAt
) {

    public static JobPostResponse from(JobPost jobPost) {
        return from(jobPost, 0);
    }

    public static JobPostResponse from(JobPost jobPost, long applicationCount) {
        var category = jobPost.getCategory() == null
                ? null
                : new CategoryInfo(jobPost.getCategory().getId(), jobPost.getCategory().getName());
        var employer = new EmployerInfo(
                jobPost.getEmployer().getUserId(),
                jobPost.getEmployer().getCompanyName(),
                jobPost.getEmployer().isApproved(),
                jobPost.getEmployer().getLogoUrl(),
                jobPost.getEmployer().getCompanyDescription(),
                jobPost.getEmployer().getWebsite(),
                jobPost.getEmployer().getAddress()
        );

        return new JobPostResponse(
                jobPost.getId(),
                jobPost.getTitle(),
                jobPost.getDescription(),
                jobPost.getRequirements(),
                jobPost.getBenefits(),
                jobPost.getSalaryMin(),
                jobPost.getSalaryMax(),
                jobPost.getLocation(),
                jobPost.getSourceUrl(),
                jobPost.getJobType(),
                jobPost.getLevel(),
                jobPost.getStatus(),
                jobPost.getDeadline(),
                jobPost.getViewCount(),
                applicationCount,
                jobPost.getTags().stream().map(tag -> tag.getName()).sorted().toList(),
                category,
                employer,
                jobPost.getCreatedAt(),
                jobPost.getUpdatedAt()
        );
    }

    public record CategoryInfo(Long id, String name) {
    }

    public record EmployerInfo(
            Long id,
            String companyName,
            boolean approved,
            String logoUrl,
            String companyDescription,
            String website,
            String address
    ) {
    }
}
