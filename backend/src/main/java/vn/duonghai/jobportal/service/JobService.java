package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.request.JobPostRequest;
import vn.duonghai.jobportal.dto.request.JobStatusRequest;
import vn.duonghai.jobportal.dto.response.JobPostResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.security.AuthenticatedUser;

public interface JobService {

    PageResponse<JobPostResponse> getPublicJobs(
            String keyword,
            String location,
            JobType jobType,
            JobLevel level,
            Long categoryId,
            int page,
            int size
    );

    JobPostResponse getJobById(Long jobId, AuthenticatedUser currentUser);

    PageResponse<JobPostResponse> getEmployerJobs(Long employerUserId, int page, int size);

    PageResponse<JobPostResponse> getJobsForReview(JobStatus status, int page, int size);

    JobPostResponse createJob(Long employerUserId, JobPostRequest request);

    JobPostResponse updateJob(Long employerUserId, Long jobId, JobPostRequest request);

    JobPostResponse updateJobStatus(Long actorUserId, Role actorRole, Long jobId, JobStatusRequest request);
}
