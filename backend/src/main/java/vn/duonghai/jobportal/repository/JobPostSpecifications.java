package vn.duonghai.jobportal.repository;

import org.springframework.data.jpa.domain.Specification;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;

public final class JobPostSpecifications {

    private JobPostSpecifications() {
    }

    public static Specification<JobPost> hasStatus(JobStatus status) {
        return (root, query, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<JobPost> hasCategory(Long categoryId) {
        return (root, query, criteriaBuilder) ->
                categoryId == null ? null : criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<JobPost> hasJobType(JobType jobType) {
        return (root, query, criteriaBuilder) ->
                jobType == null ? null : criteriaBuilder.equal(root.get("jobType"), jobType);
    }

    public static Specification<JobPost> hasLevel(JobLevel level) {
        return (root, query, criteriaBuilder) ->
                level == null ? null : criteriaBuilder.equal(root.get("level"), level);
    }

    public static Specification<JobPost> locationContains(String location) {
        return (root, query, criteriaBuilder) -> {
            if (location == null || location.isBlank()) {
                return null;
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")),
                    "%" + location.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<JobPost> keywordContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return null;
            }

            var normalized = "%" + keyword.trim().toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), normalized),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), normalized),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("requirements")), normalized),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("employer").get("companyName")), normalized)
            );
        };
    }
}
