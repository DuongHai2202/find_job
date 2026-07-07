package vn.duonghai.jobportal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.request.SavedJobRequest;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.dto.response.SavedJobResponse;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.SavedJobService;

@RestController
@RequestMapping("/api/v1/saved-jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SavedJobResponse saveJob(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody SavedJobRequest request
    ) {
        return savedJobService.saveJob(currentUser.id(), request.jobId());
    }

    @DeleteMapping("/{jobId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSavedJob(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long jobId
    ) {
        savedJobService.removeSavedJob(currentUser.id(), jobId);
    }

    @GetMapping
    public PageResponse<SavedJobResponse> getSavedJobs(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return savedJobService.getSavedJobs(currentUser.id(), page, size);
    }
}
