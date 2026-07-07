package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.request.EmployerProfileRequest;
import vn.duonghai.jobportal.dto.response.EmployerProfileResponse;

public interface EmployerService {

    EmployerProfileResponse getMyProfile(Long employerUserId);

    EmployerProfileResponse updateMyProfile(Long employerUserId, EmployerProfileRequest request);

    EmployerProfileResponse getCompanyProfile(Long employerUserId);
}
