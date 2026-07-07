package vn.duonghai.jobportal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.duonghai.jobportal.dto.request.CandidateProfileRequest;
import vn.duonghai.jobportal.dto.request.ResumeRequest;
import vn.duonghai.jobportal.dto.response.CandidateProfileResponse;
import vn.duonghai.jobportal.dto.response.ResumeResponse;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.CandidateService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/candidates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping("/me")
    public CandidateProfileResponse getMyProfile(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return candidateService.getMyProfile(currentUser.id());
    }

    @PutMapping("/me")
    public CandidateProfileResponse updateMyProfile(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody CandidateProfileRequest request
    ) {
        return candidateService.updateMyProfile(currentUser.id(), request);
    }

    @GetMapping("/me/resumes")
    public List<ResumeResponse> getMyResumes(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return candidateService.getMyResumes(currentUser.id());
    }

    @PostMapping("/me/resumes")
    public ResumeResponse createResume(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody ResumeRequest request
    ) {
        return candidateService.createResume(currentUser.id(), request);
    }

    @PostMapping(value = "/me/resumes/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResumeResponse uploadResume(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam String title,
            @RequestParam(required = false) String content,
            @RequestParam("file") MultipartFile file
    ) {
        return candidateService.uploadResume(currentUser.id(), title, content, file);
    }

    @PutMapping("/me/resumes/{resumeId}")
    public ResumeResponse updateResume(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long resumeId,
            @Valid @RequestBody ResumeRequest request
    ) {
        return candidateService.updateResume(currentUser.id(), resumeId, request);
    }

    @DeleteMapping("/me/resumes/{resumeId}")
    public void deleteResume(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long resumeId
    ) {
        candidateService.deleteResume(currentUser.id(), resumeId);
    }
}