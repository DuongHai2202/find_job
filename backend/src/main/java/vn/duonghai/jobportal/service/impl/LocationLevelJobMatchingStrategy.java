package vn.duonghai.jobportal.service.impl;

import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.service.JobMatchingContext;
import vn.duonghai.jobportal.service.JobMatchingStrategy;

@Component
public class LocationLevelJobMatchingStrategy implements JobMatchingStrategy {

    @Override
    public double score(Candidate candidate, JobPost jobPost, JobMatchingContext context) {
        double score = 0.0;

        var location = normalize(jobPost.getLocation());
        for (var preferredLocation : context.preferredLocations()) {
            if (!preferredLocation.isBlank() && location.contains(preferredLocation)) {
                score += 4.0;
                break;
            }
        }

        if (jobPost.getLevel() != null && context.preferredLevels().contains(jobPost.getLevel())) {
            score += 2.0;
        }

        return score;
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase();
    }
}
