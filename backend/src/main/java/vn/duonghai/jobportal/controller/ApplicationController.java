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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.request.ApplicationCreateRequest;
import vn.duonghai.jobportal.dto.request.ApplicationStatusUpdateRequest;
import vn.duonghai.jobportal.dto.response.ApplicationResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.facade.ApplicationFacade;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationFacade applicationFacade;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse apply(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody ApplicationCreateRequest request
    ) {
        return applicationFacade.apply(currentUser.id(), request);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public PageResponse<ApplicationResponse> getMyApplications(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return applicationFacade.getMyApplications(currentUser.id(), page, size);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public PageResponse<ApplicationResponse> getEmployerApplications(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(required = false) Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return applicationFacade.getEmployerApplications(currentUser.id(), jobId, page, size);
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ApplicationResponse updateStatus(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        return applicationFacade.updateStatus(currentUser.id(), applicationId, request);
    }
}
