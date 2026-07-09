package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.response.AdminEmployerResponse;
import vn.duonghai.jobportal.dto.response.AdminUserResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;
import vn.duonghai.jobportal.enums.UserStatus;

public interface AdminService {

    PageResponse<AdminEmployerResponse> getPendingEmployers(int page, int size);

    AdminEmployerResponse reviewEmployer(Long employerUserId, EmployerReviewStatus status);

    PageResponse<AdminUserResponse> getUsers(int page, int size);

    AdminUserResponse updateUserStatus(Long actorUserId, Long userId, UserStatus status);
}
