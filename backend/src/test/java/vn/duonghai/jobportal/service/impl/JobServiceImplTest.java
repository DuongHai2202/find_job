package vn.duonghai.jobportal.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.duonghai.jobportal.dto.request.JobStatusRequest;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.repository.CategoryRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.service.NotificationEventPublisher;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceImplTest {

    @Mock
    private JobPostRepository jobPostRepository;
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private NotificationEventPublisher notificationEventPublisher;

    private JobServiceImpl jobService;

    @BeforeEach
    void setUp() {
        jobService = new JobServiceImpl(
                jobPostRepository,
                employerRepository,
                categoryRepository,
                applicationRepository,
                notificationEventPublisher
        );
    }

    @Test
    void updateJobStatus_shouldNotifyFollowersWhenAdminApprovesPendingJob() {
        var employer = employer(20L);
        var jobPost = new JobPost();
        jobPost.setId(100L);
        jobPost.setEmployer(employer);
        jobPost.setTitle("Platform Engineer");
        jobPost.setStatus(JobStatus.PENDING);

        when(jobPostRepository.findById(100L)).thenReturn(Optional.of(jobPost));
        when(jobPostRepository.save(jobPost)).thenAnswer(invocation -> invocation.getArgument(0));
        when(applicationRepository.countByJobPost(jobPost)).thenReturn(0L);

        var response = jobService.updateJobStatus(1L, Role.ADMIN, 100L, new JobStatusRequest(JobStatus.APPROVED));

        assertEquals(JobStatus.APPROVED, response.status());
        verify(notificationEventPublisher, times(1)).publishJobApproved(jobPost);
    }

    private Employer employer(Long userId) {
        var user = new User();
        user.setId(userId);
        user.setRole(Role.EMPLOYER);

        var employer = new Employer();
        employer.setUserId(userId);
        employer.setUser(user);
        employer.setCompanyName("Acme");
        employer.setApproved(true);
        return employer;
    }
}
