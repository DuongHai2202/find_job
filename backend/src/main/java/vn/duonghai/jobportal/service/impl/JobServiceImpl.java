package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.request.JobPostRequest;
import vn.duonghai.jobportal.dto.request.JobStatusRequest;
import vn.duonghai.jobportal.dto.response.JobPostResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.entity.Category;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CategoryRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.JobPostSpecifications;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.JobService;
import vn.duonghai.jobportal.service.NotificationEventPublisher;
import vn.duonghai.jobportal.service.PageableSupport;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobServiceImpl implements JobService {

    private static final Set<JobStatus> EMPLOYER_ALLOWED_STATUSES =
            Set.of(JobStatus.DRAFT, JobStatus.PENDING, JobStatus.HIDDEN, JobStatus.EXPIRED);

    private final JobPostRepository jobPostRepository;
    private final EmployerRepository employerRepository;
    private final CategoryRepository categoryRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationEventPublisher notificationEventPublisher;

    @Override
    public PageResponse<JobPostResponse> getPublicJobs(
            String keyword,
            String location,
            JobType jobType,
            JobLevel level,
            Long categoryId,
            int page,
            int size
    ) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<JobPost> specification = Specification.allOf(
                JobPostSpecifications.hasStatus(JobStatus.APPROVED),
                JobPostSpecifications.keywordContains(keyword),
                JobPostSpecifications.locationContains(location),
                JobPostSpecifications.hasJobType(jobType),
                JobPostSpecifications.hasLevel(level),
                JobPostSpecifications.hasCategory(categoryId)
        );

        var resultPage = jobPostRepository.findAll(specification, pageable)
                .map(this::toJobPostResponse);
        return PageResponse.from(resultPage);
    }

    @Override
    @Transactional
    public JobPostResponse getJobById(Long jobId, AuthenticatedUser currentUser) {
        JobPost jobPost = getJobOrThrow(jobId);
        if (!canAccessJob(currentUser, jobPost)) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay tin tuyen dung");
        }

        if (jobPost.getStatus() == JobStatus.APPROVED) {
            jobPost.setViewCount(jobPost.getViewCount() + 1);
        }
        return toJobPostResponse(jobPost);
    }

    @Override
    public PageResponse<JobPostResponse> getEmployerJobs(Long employerUserId, int page, int size) {
        verifyEmployerAccess(employerUserId);
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = jobPostRepository.findByEmployer_UserId(employerUserId, pageable)
                .map(this::toJobPostResponse);
        return PageResponse.from(resultPage);
    }

    @Override
    public PageResponse<JobPostResponse> getJobsForReview(JobStatus status, int page, int size) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = jobPostRepository.findByStatus(status == null ? JobStatus.PENDING : status, pageable)
                .map(this::toJobPostResponse);
        return PageResponse.from(resultPage);
    }

    @Override
    @Transactional
    public JobPostResponse createJob(Long employerUserId, JobPostRequest request) {
        Employer employer = verifyEmployerAccess(employerUserId);
        validateSalary(request);

        JobPost jobPost = new JobPost();
        jobPost.setEmployer(employer);
        applyJobData(jobPost, request);
        jobPost.setStatus(JobStatus.PENDING);
        return toJobPostResponse(jobPostRepository.save(jobPost));
    }

    @Override
    @Transactional
    public JobPostResponse updateJob(Long employerUserId, Long jobId, JobPostRequest request) {
        Employer employer = verifyEmployerAccess(employerUserId);
        validateSalary(request);

        JobPost jobPost = getJobOrThrow(jobId);
        if (!jobPost.getEmployer().getUserId().equals(employer.getUserId())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Ban khong co quyen sua tin tuyen dung nay");
        }

        applyJobData(jobPost, request);
        if (jobPost.getStatus() == JobStatus.APPROVED || jobPost.getStatus() == JobStatus.HIDDEN) {
            jobPost.setStatus(JobStatus.PENDING);
        }
        return toJobPostResponse(jobPostRepository.save(jobPost));
    }

    @Override
    @Transactional
    public JobPostResponse updateJobStatus(Long actorUserId, Role actorRole, Long jobId, JobStatusRequest request) {
        JobPost jobPost = getJobOrThrow(jobId);
        JobStatus previousStatus = jobPost.getStatus();

        if (actorRole == Role.EMPLOYER) {
            verifyEmployerCanChangeStatus(actorUserId, jobPost, request.status());
        } else if (actorRole != Role.ADMIN) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Ban khong co quyen cap nhat trang thai tin");
        }

        jobPost.setStatus(request.status());
        JobPost saved = jobPostRepository.save(jobPost);
        if (actorRole == Role.ADMIN
                && previousStatus != JobStatus.APPROVED
                && saved.getStatus() == JobStatus.APPROVED) {
            notificationEventPublisher.publishJobApproved(saved);
        }
        return toJobPostResponse(saved);
    }

    private void applyJobData(JobPost jobPost, JobPostRequest request) {
        jobPost.setTitle(request.title().trim());
        jobPost.setDescription(normalizeNullable(request.description()));
        jobPost.setRequirements(normalizeNullable(request.requirements()));
        jobPost.setBenefits(normalizeNullable(request.benefits()));
        jobPost.setSalaryMin(request.salaryMin());
        jobPost.setSalaryMax(request.salaryMax());
        jobPost.setLocation(normalizeNullable(request.location()));
        jobPost.setJobType(request.jobType());
        jobPost.setLevel(request.level());
        jobPost.setCategory(resolveCategory(request.categoryId()));
        jobPost.setDeadline(request.deadline());
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay danh muc"));
    }

    private void validateSalary(JobPostRequest request) {
        if (request.salaryMin() != null
                && request.salaryMax() != null
                && request.salaryMin().compareTo(request.salaryMax()) > 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Luong toi thieu khong duoc lon hon luong toi da");
        }
    }

    private boolean canAccessJob(AuthenticatedUser currentUser, JobPost jobPost) {
        if (jobPost.getStatus() == JobStatus.APPROVED) {
            return true;
        }
        if (currentUser == null) {
            return false;
        }
        Role role = extractRole(currentUser);
        return role == Role.ADMIN
                || (role == Role.EMPLOYER && jobPost.getEmployer().getUserId().equals(currentUser.id()));
    }

    private Role extractRole(AuthenticatedUser currentUser) {
        return currentUser.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .map(Role::valueOf)
                .orElseThrow(() -> new BusinessException(HttpStatus.FORBIDDEN, "Khong xac dinh duoc vai tro hien tai"));
    }

    private Employer verifyEmployerAccess(Long employerUserId) {
        Employer employer = employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so nha tuyen dung"));
        if (!employer.isApproved()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Tai khoan nha tuyen dung chua duoc phe duyet");
        }
        return employer;
    }

    private void verifyEmployerCanChangeStatus(Long employerUserId, JobPost jobPost, JobStatus status) {
        verifyEmployerAccess(employerUserId);
        if (!jobPost.getEmployer().getUserId().equals(employerUserId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Ban khong co quyen cap nhat tin tuyen dung nay");
        }
        if (!EMPLOYER_ALLOWED_STATUSES.contains(status)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Nha tuyen dung khong the dat trang thai nay");
        }
    }

    private JobPost getJobOrThrow(Long jobId) {
        return jobPostRepository.findById(jobId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay tin tuyen dung"));
    }

    private JobPostResponse toJobPostResponse(JobPost jobPost) {
        return JobPostResponse.from(jobPost, applicationRepository.countByJobPost(jobPost));
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
