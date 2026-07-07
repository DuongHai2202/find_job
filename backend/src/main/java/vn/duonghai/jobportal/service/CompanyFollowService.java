package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.response.CompanyFollowResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;

public interface CompanyFollowService {

    CompanyFollowResponse followCompany(Long candidateUserId, Long employerUserId);

    void unfollowCompany(Long candidateUserId, Long employerUserId);

    PageResponse<CompanyFollowResponse> getMyFollows(Long candidateUserId, int page, int size);
}