package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.enums.ApplicationStatus;

import java.time.Instant;

public record ApplicationResponse(
        Long id,
        ApplicationStatus status,
        String coverLetter,
        String note,
        Instant createdAt,
        Instant updatedAt,
        JobPostResponse job,
        CandidateSummary candidate,
        ResumeSummary resume
) {

    public static ApplicationResponse from(Application application) {
        var candidate = new CandidateSummary(
                application.getCandidate().getUserId(),
                application.getCandidate().getUser().getFullName(),
                application.getCandidate().getUser().getEmail(),
                application.getCandidate().getHeadline()
        );
        var resume = application.getResume() == null
                ? null
                : new ResumeSummary(
                        application.getResume().getId(),
                        application.getResume().getTitle(),
                        application.getResume().getFileUrl()
                );

        return new ApplicationResponse(
                application.getId(),
                application.getStatus(),
                application.getCoverLetter(),
                application.getNote(),
                application.getCreatedAt(),
                application.getUpdatedAt(),
                JobPostResponse.from(application.getJobPost()),
                candidate,
                resume
        );
    }

    public record CandidateSummary(Long userId, String fullName, String email, String headline) {
    }

    public record ResumeSummary(Long id, String title, String fileUrl) {
    }
}
