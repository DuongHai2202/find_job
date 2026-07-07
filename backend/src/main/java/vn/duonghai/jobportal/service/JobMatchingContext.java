package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.enums.JobLevel;

import java.util.Set;

public record JobMatchingContext(
        Set<Long> preferredCategoryIds,
        Set<String> preferredLocations,
        Set<String> profileKeywords,
        Set<JobLevel> preferredLevels,
        Set<Long> excludedJobIds
) {
}
