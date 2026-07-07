package vn.duonghai.jobportal.service.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.request.ApplicationCreateRequest;
import vn.duonghai.jobportal.dto.request.ApplicationStatusUpdateRequest;
import vn.duonghai.jobportal.dto.response.ApplicationResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.Resume;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.ResumeRepository;
import vn.duonghai.jobportal.service.NotificationEventPublisher;
import vn.duonghai.jobportal.service.PageableSupport;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationFacade {

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;
    private final JobPostRepository jobPostRepository;
    private final ResumeRepository resumeRepository;
    private final NotificationEventPublisher notificationEventPublisher;

    @Transactional
    public ApplicationResponse apply(Long candidateUserId, ApplicationCreateRequest request) {
        var candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
        var jobPost = jobPostRepository.findById(request.jobId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay tin tuyen dung"));

        if (jobPost.getStatus() != JobStatus.APPROVED) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Chi co the ung tuyen vao tin da duyet");
        }
        if (jobPost.getDeadline() != null && jobPost.getDeadline().isBefore(LocalDate.now())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Tin tuyen dung da het han ung tuyen");
        }
        if (applicationRepository.existsByJobPostAndCandidate(jobPost, candidate)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Ban da ung tuyen vao tin nay roi");
        }

        var application = new Application();
        application.setCandidate(candidate);
        application.setJobPost(jobPost);
        application.setResume(resolveResume(candidateUserId, request.resumeId()));
        application.setCoverLetter(normalizeNullable(request.coverLetter()));
        application.setNote(null);

        return ApplicationResponse.from(applicationRepository.save(application));
    }

    public PageResponse<ApplicationResponse> getMyApplications(Long candidateUserId, int page, int size) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = applicationRepository.findByCandidate_UserId(candidateUserId, pageable)
                .map(ApplicationResponse::from);
        return PageResponse.from(resultPage);
    }

    public PageResponse<ApplicationResponse> getEmployerApplications(Long employerUserId, Long jobId, int page, int size) {
        verifyEmployer(employerUserId);
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = (jobId == null
                ? applicationRepository.findByJobPost_Employer_UserId(employerUserId, pageable)
                : applicationRepository.findByJobPost_Employer_UserIdAndJobPost_Id(employerUserId, jobId, pageable))
                .map(ApplicationResponse::from);
        return PageResponse.from(resultPage);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long employerUserId, Long applicationId, ApplicationStatusUpdateRequest request) {
        verifyEmployer(employerUserId);
        var application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung tuyen"));

        if (!application.getJobPost().getEmployer().getUserId().equals(employerUserId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Ban khong co quyen cap nhat ho so nay");
        }

        var statusChanged = application.getStatus() != request.status();
        application.setStatus(request.status());
        application.setNote(normalizeNullable(request.note()));
        var saved = applicationRepository.save(application);
        if (statusChanged) {
            notificationEventPublisher.publishApplicationStatusChanged(saved);
        }
        return ApplicationResponse.from(saved);
    }

    private void verifyEmployer(Long employerUserId) {
        var employer = employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so nha tuyen dung"));
        if (!employer.isApproved()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Tai khoan nha tuyen dung chua duoc phe duyet");
        }
    }

    private Resume resolveResume(Long candidateUserId, Long resumeId) {
        if (resumeId == null) {
            return null;
        }
        return resumeRepository.findByIdAndCandidate_UserId(resumeId, candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay CV thuoc ve ung vien"));
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
