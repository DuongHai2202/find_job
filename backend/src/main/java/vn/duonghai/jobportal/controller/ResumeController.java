package vn.duonghai.jobportal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.CandidateService;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final CandidateService candidateService;

    @GetMapping("/{resumeId}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadResume(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long resumeId
    ) {
        var download = candidateService.downloadResume(currentUser.id(), extractRole(currentUser), resumeId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(download.downloadFileName())
                        .build()
                        .toString())
                .contentType(MediaType.parseMediaType(download.contentType()))
                .body(download.resource());
    }

    private Role extractRole(AuthenticatedUser currentUser) {
        return currentUser.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .map(Role::valueOf)
                .orElseThrow();
    }
}