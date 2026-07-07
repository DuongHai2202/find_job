package vn.duonghai.jobportal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.response.CompanyFollowResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.CompanyFollowService;

@RestController
@RequestMapping("/api/v1/company-follows")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CompanyFollowController {

    private final CompanyFollowService companyFollowService;

    @PostMapping("/employers/{employerUserId}")
    public CompanyFollowResponse followCompany(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long employerUserId
    ) {
        return companyFollowService.followCompany(currentUser.id(), employerUserId);
    }

    @DeleteMapping("/employers/{employerUserId}")
    public void unfollowCompany(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long employerUserId
    ) {
        companyFollowService.unfollowCompany(currentUser.id(), employerUserId);
    }

    @GetMapping("/me")
    public PageResponse<CompanyFollowResponse> getMyFollows(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return companyFollowService.getMyFollows(currentUser.id(), page, size);
    }
}
