package vn.duonghai.jobportal.service.impl;

import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.service.JobMatchingContext;
import vn.duonghai.jobportal.service.JobMatchingStrategy;

@Component
public class CategoryJobMatchingStrategy implements JobMatchingStrategy {

    @Override
    public double score(Candidate candidate, JobPost jobPost, JobMatchingContext context) {
        double score = 0.0;

        if (jobPost.getCategory() != null
                && context.preferredCategoryIds().contains(jobPost.getCategory().getId())) {
            score += 6.0;
        }

        var title = normalize(jobPost.getTitle());
        var description = normalize(jobPost.getDescription());
        var requirements = normalize(jobPost.getRequirements());

        for (var keyword : context.profileKeywords()) {
            if (keyword.isBlank()) {
                continue;
            }
            if (title.contains(keyword)) {
                score += 2.5;
            } else if (description.contains(keyword) || requirements.contains(keyword)) {
                score += 1.0;
            }
        }

        return score;
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase();
    }
}
