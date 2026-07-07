package vn.duonghai.jobportal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.request.JobPostRequest;
import vn.duonghai.jobportal.dto.request.JobStatusRequest;
import vn.duonghai.jobportal.dto.response.JobPostResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.JobService;
import vn.duonghai.jobportal.service.JobRecommendationService;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final JobRecommendationService jobRecommendationService;

    @GetMapping
    public PageResponse<JobPostResponse> getPublicJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) JobLevel level,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.getPublicJobs(keyword, location, jobType, level, categoryId, page, size);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public PageResponse<JobPostResponse> getEmployerJobs(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.getEmployerJobs(currentUser.id(), page, size);
    }

    @GetMapping("/recommendations/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public PageResponse<JobPostResponse> getMyRecommendations(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobRecommendationService.getRecommendations(currentUser.id(), page, size);
    }

    @GetMapping("/admin/review")
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<JobPostResponse> getJobsForReview(
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.getJobsForReview(status, page, size);
    }

    @GetMapping("/{jobId}")
    public JobPostResponse getJobById(
            @PathVariable Long jobId,
            @AuthenticationPrincipal AuthenticatedUser currentUser
    ) {
        return jobService.getJobById(jobId, currentUser);
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    @ResponseStatus(HttpStatus.CREATED)
    public JobPostResponse createJob(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody JobPostRequest request
    ) {
        return jobService.createJob(currentUser.id(), request);
    }

    @PutMapping("/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobPostResponse updateJob(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long jobId,
            @Valid @RequestBody JobPostRequest request
    ) {
        return jobService.updateJob(currentUser.id(), jobId, request);
    }

    @PatchMapping("/{jobId}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public JobPostResponse updateJobStatus(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long jobId,
            @Valid @RequestBody JobStatusRequest request
    ) {
        return jobService.updateJobStatus(currentUser.id(), extractRole(currentUser), jobId, request);
    }

    private Role extractRole(AuthenticatedUser currentUser) {
        return currentUser.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .map(Role::valueOf)
                .orElseThrow();
    }
}
