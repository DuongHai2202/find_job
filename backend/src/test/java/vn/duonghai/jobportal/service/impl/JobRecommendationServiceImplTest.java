package vn.duonghai.jobportal.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Category;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.SavedJob;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.SavedJobRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobRecommendationServiceImplTest {

    @Mock
    private CandidateRepository candidateRepository;
    @Mock
    private SavedJobRepository savedJobRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private JobPostRepository jobPostRepository;

    private JobRecommendationServiceImpl jobRecommendationService;

    @BeforeEach
    void setUp() {
        jobRecommendationService = new JobRecommendationServiceImpl(
                candidateRepository,
                savedJobRepository,
                applicationRepository,
                jobPostRepository,
                List.of(new CategoryJobMatchingStrategy(), new LocationLevelJobMatchingStrategy())
        );
    }

    @Test
    void getRecommendations_shouldPrioritizeMatchingCategoryAndLocation() {
        var candidate = candidate(10L, "Ha Noi", "Java Backend");
        var preferredJob = job(1L, "Java Backend Developer", "Ha Noi", 100L, JobLevel.JUNIOR, Instant.parse("2026-06-28T00:00:00Z"));
        var otherJob = job(2L, "Designer", "Da Nang", 200L, JobLevel.MANAGER, Instant.parse("2026-06-27T00:00:00Z"));

        var savedJob = new SavedJob();
        savedJob.setJobPost(preferredJob);
        savedJob.setCandidate(candidate);

        when(candidateRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(savedJobRepository.findTop20ByCandidate_UserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(savedJob));
        when(applicationRepository.findTop20ByCandidate_UserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of());
        when(jobPostRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(otherJob, preferredJob)));

        var response = jobRecommendationService.getRecommendations(10L, 0, 10);

        assertEquals(2, response.content().size());
        assertEquals(preferredJob.getId(), response.content().get(0).id());
    }

    @Test
    void getRecommendations_shouldFallbackToRecentApprovedJobsWhenNoPreferenceData() {
        var candidate = candidate(10L, null, null);
        var newestJob = job(3L, "QA Engineer", "Remote", 300L, JobLevel.JUNIOR, Instant.parse("2026-06-28T00:00:00Z"));
        var olderJob = job(4L, "Support Engineer", "Remote", 400L, JobLevel.JUNIOR, Instant.parse("2026-06-20T00:00:00Z"));

        when(candidateRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(savedJobRepository.findTop20ByCandidate_UserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of());
        when(applicationRepository.findTop20ByCandidate_UserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of());
        when(jobPostRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(olderJob, newestJob)));

        var response = jobRecommendationService.getRecommendations(10L, 0, 10);

        assertEquals(2, response.content().size());
        assertEquals(newestJob.getId(), response.content().get(0).id());
        assertEquals(olderJob.getId(), response.content().get(1).id());
    }

    private Candidate candidate(Long userId, String address, String headline) {
        var user = new User();
        user.setId(userId);
        user.setRole(Role.CANDIDATE);
        user.setEmail("candidate@test.dev");
        user.setFullName("Candidate");

        var candidate = new Candidate();
        candidate.setUserId(userId);
        candidate.setUser(user);
        candidate.setAddress(address);
        candidate.setHeadline(headline);
        return candidate;
    }

    private JobPost job(
            Long id,
            String title,
            String location,
            Long categoryId,
            JobLevel level,
            Instant createdAt
    ) {
        var category = new Category();
        category.setId(categoryId);
        category.setName("Category " + categoryId);

        var employerUser = new User();
        employerUser.setId(1000L + id);
        employerUser.setRole(Role.EMPLOYER);

        var employer = new Employer();
        employer.setUserId(1000L + id);
        employer.setUser(employerUser);
        employer.setCompanyName("Company " + id);
        employer.setApproved(true);

        var jobPost = new JobPost();
        jobPost.setId(id);
        jobPost.setTitle(title);
        jobPost.setLocation(location);
        jobPost.setCategory(category);
        jobPost.setLevel(level);
        jobPost.setJobType(JobType.FULLTIME);
        jobPost.setEmployer(employer);
        jobPost.setStatus(JobStatus.APPROVED);
        jobPost.setCreatedAt(createdAt);
        return jobPost;
    }
}
