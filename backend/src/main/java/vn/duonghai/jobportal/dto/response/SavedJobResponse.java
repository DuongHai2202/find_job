package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.SavedJob;

import java.time.Instant;

public record SavedJobResponse(
        Long id,
        Instant savedAt,
        JobPostResponse job
) {

    public static SavedJobResponse from(SavedJob savedJob) {
        return new SavedJobResponse(
                savedJob.getId(),
                savedJob.getCreatedAt(),
                JobPostResponse.from(savedJob.getJobPost())
        );
    }
}
