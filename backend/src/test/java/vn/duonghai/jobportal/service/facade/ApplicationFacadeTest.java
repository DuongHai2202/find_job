package vn.duonghai.jobportal.service.facade;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.duonghai.jobportal.dto.request.ApplicationCreateRequest;
import vn.duonghai.jobportal.dto.request.ApplicationStatusUpdateRequest;
import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.ApplicationStatus;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.ResumeRepository;
import vn.duonghai.jobportal.service.NotificationEventPublisher;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationFacadeTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private CandidateRepository candidateRepository;
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private JobPostRepository jobPostRepository;
    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private NotificationEventPublisher notificationEventPublisher;

    private ApplicationFacade applicationFacade;

    @BeforeEach
    void setUp() {
        applicationFacade = new ApplicationFacade(
                applicationRepository,
                candidateRepository,
                employerRepository,
                jobPostRepository,
                resumeRepository,
                notificationEventPublisher
        );
    }

    @Test
    void apply_shouldRejectExpiredApprovedJob() {
        var candidate = candidate(10L, "candidate@test.dev");
        var jobPost = jobPost(100L, 20L, JobStatus.APPROVED);
        jobPost.setDeadline(LocalDate.now().minusDays(1));

        when(candidateRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(jobPostRepository.findById(100L)).thenReturn(Optional.of(jobPost));

        var ex = assertThrows(BusinessException.class, () ->
                applicationFacade.apply(10L, new ApplicationCreateRequest(100L, null, "Cover letter")));

        assertEquals("Tin tuyen dung da het han ung tuyen", ex.getMessage());
        verify(applicationRepository, never()).save(any());
    }

    @Test
    void updateStatus_shouldNotNotifyWhenStatusUnchanged() {
        var employer = employer(20L);
        var application = application(200L, employer, ApplicationStatus.VIEWED);

        when(employerRepository.findById(20L)).thenReturn(Optional.of(employer));
        when(applicationRepository.findById(200L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = applicationFacade.updateStatus(
                20L,
                200L,
                new ApplicationStatusUpdateRequest(ApplicationStatus.VIEWED, "Still under review")
        );

        assertEquals(ApplicationStatus.VIEWED, response.status());
        verify(notificationEventPublisher, never()).publishApplicationStatusChanged(any(Application.class));
    }

    private Candidate candidate(Long userId, String email) {
        var user = new User();
        user.setId(userId);
        user.setEmail(email);
        user.setRole(Role.CANDIDATE);
        user.setFullName("Candidate");

        var candidate = new Candidate();
        candidate.setUserId(userId);
        candidate.setUser(user);
        candidate.setHeadline("Java Developer");
        return candidate;
    }

    private Employer employer(Long userId) {
        var user = new User();
        user.setId(userId);
        user.setEmail("employer@test.dev");
        user.setRole(Role.EMPLOYER);
        user.setFullName("Employer");

        var employer = new Employer();
        employer.setUserId(userId);
        employer.setUser(user);
        employer.setCompanyName("Acme");
        employer.setApproved(true);
        return employer;
    }

    private JobPost jobPost(Long jobId, Long employerUserId, JobStatus status) {
        var jobPost = new JobPost();
        jobPost.setId(jobId);
        jobPost.setEmployer(employer(employerUserId));
        jobPost.setTitle("Backend Engineer");
        jobPost.setStatus(status);
        return jobPost;
    }

    private Application application(Long applicationId, Employer employer, ApplicationStatus status) {
        var application = new Application();
        application.setId(applicationId);
        application.setStatus(status);
        application.setCandidate(candidate(10L, "candidate@test.dev"));

        var jobPost = new JobPost();
        jobPost.setId(100L);
        jobPost.setEmployer(employer);
        jobPost.setTitle("Backend Engineer");
        jobPost.setStatus(JobStatus.APPROVED);
        application.setJobPost(jobPost);
        return application;
    }
}
