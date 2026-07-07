package vn.duonghai.jobportal.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import vn.duonghai.jobportal.dto.request.CandidateProfileRequest;
import vn.duonghai.jobportal.dto.request.ResumeRequest;
import vn.duonghai.jobportal.dto.response.CandidateProfileResponse;
import vn.duonghai.jobportal.dto.response.ResumeResponse;
import vn.duonghai.jobportal.enums.Role;

import java.util.List;

public interface CandidateService {

    record ResumeDownload(
            Resource resource,
            String downloadFileName,
            String contentType
    ) {
    }

    CandidateProfileResponse getMyProfile(Long candidateUserId);

    CandidateProfileResponse updateMyProfile(Long candidateUserId, CandidateProfileRequest request);

    List<ResumeResponse> getMyResumes(Long candidateUserId);

    ResumeResponse createResume(Long candidateUserId, ResumeRequest request);

    ResumeResponse uploadResume(Long candidateUserId, String title, String content, MultipartFile file);

    ResumeResponse updateResume(Long candidateUserId, Long resumeId, ResumeRequest request);

    void deleteResume(Long candidateUserId, Long resumeId);

    ResumeDownload downloadResume(Long actorUserId, Role actorRole, Long resumeId);
}