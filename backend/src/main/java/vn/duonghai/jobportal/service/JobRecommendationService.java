package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.response.JobPostResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;

public interface JobRecommendationService {

    PageResponse<JobPostResponse> getRecommendations(Long candidateUserId, int page, int size);
}
