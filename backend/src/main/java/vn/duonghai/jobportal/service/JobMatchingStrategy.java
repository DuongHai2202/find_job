package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;

public interface JobMatchingStrategy {

    double score(Candidate candidate, JobPost jobPost, JobMatchingContext context);
}
