package vn.duonghai.jobportal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.request.EmployerProfileRequest;
import vn.duonghai.jobportal.dto.response.EmployerProfileResponse;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.EmployerService;

@RestController
@RequestMapping("/api/v1/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYER')")
    public EmployerProfileResponse getMyProfile(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return employerService.getMyProfile(currentUser.id());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('EMPLOYER')")
    @ResponseStatus(HttpStatus.OK)
    public EmployerProfileResponse updateMyProfile(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody EmployerProfileRequest request
    ) {
        return employerService.updateMyProfile(currentUser.id(), request);
    }

    @GetMapping("/{employerId}")
    public EmployerProfileResponse getCompanyProfile(@PathVariable Long employerId) {
        return employerService.getCompanyProfile(employerId);
    }
}
