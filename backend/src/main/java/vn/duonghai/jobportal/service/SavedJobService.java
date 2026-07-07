package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.dto.response.SavedJobResponse;

public interface SavedJobService {

    SavedJobResponse saveJob(Long candidateUserId, Long jobId);

    void removeSavedJob(Long candidateUserId, Long jobId);

    PageResponse<SavedJobResponse> getSavedJobs(Long candidateUserId, int page, int size);
}
