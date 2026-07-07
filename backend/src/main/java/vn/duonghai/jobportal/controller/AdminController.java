package vn.duonghai.jobportal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.request.EmployerApprovalRequest;
import vn.duonghai.jobportal.dto.request.UserStatusUpdateRequest;
import vn.duonghai.jobportal.dto.response.AdminEmployerResponse;
import vn.duonghai.jobportal.dto.response.AdminUserResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.service.AdminService;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/employers/pending")
    public PageResponse<AdminEmployerResponse> getPendingEmployers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getPendingEmployers(page, size);
    }

    @PatchMapping("/employers/{employerUserId}/approval")
    public AdminEmployerResponse reviewEmployer(
            @PathVariable Long employerUserId,
            @RequestBody EmployerApprovalRequest request
    ) {
        return adminService.reviewEmployer(employerUserId, request.approved());
    }

    @GetMapping("/users")
    public PageResponse<AdminUserResponse> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getUsers(page, size);
    }

    @PatchMapping("/users/{userId}/status")
    public AdminUserResponse updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        return adminService.updateUserStatus(userId, request.status());
    }
}
