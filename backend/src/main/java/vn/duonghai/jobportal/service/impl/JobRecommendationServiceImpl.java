package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.response.JobPostResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.SavedJob;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.SavedJobRepository;
import vn.duonghai.jobportal.repository.JobPostSpecifications;
import vn.duonghai.jobportal.service.JobMatchingContext;
import vn.duonghai.jobportal.service.JobMatchingStrategy;
import vn.duonghai.jobportal.service.JobRecommendationService;
import vn.duonghai.jobportal.service.PageableSupport;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobRecommendationServiceImpl implements JobRecommendationService {

    private static final int CANDIDATE_HISTORY_LIMIT = 20;
    private static final int RECOMMENDATION_POOL_SIZE = 200;

    private final CandidateRepository candidateRepository;
    private final SavedJobRepository savedJobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final List<JobMatchingStrategy> jobMatchingStrategies;

    @Override
    public PageResponse<JobPostResponse> getRecommendations(Long candidateUserId, int page, int size) {
        Candidate candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));

        List<SavedJob> recentSavedJobs =
                savedJobRepository.findTop20ByCandidate_UserIdOrderByCreatedAtDesc(candidateUserId);
        List<Application> recentApplications =
                applicationRepository.findTop20ByCandidate_UserIdOrderByCreatedAtDesc(candidateUserId);
        JobMatchingContext context = buildContext(candidate, recentSavedJobs, recentApplications);

        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<JobPost> approvedJobs = jobPostRepository.findAll(
                org.springframework.data.jpa.domain.Specification.allOf(
                        JobPostSpecifications.hasStatus(JobStatus.APPROVED)
                ),
                PageableSupport.pageRequest(0, RECOMMENDATION_POOL_SIZE, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        List<RankedJob> rankedJobs = approvedJobs.stream()
                .filter(jobPost -> isEligible(jobPost, context))
                .map(jobPost -> new RankedJob(jobPost, totalScore(candidate, jobPost, context)))
                .sorted(Comparator
                        .comparingDouble(RankedJob::score).reversed()
                        .thenComparing(ranked -> safeCreatedAt(ranked.jobPost()), Comparator.reverseOrder()))
                .toList();

        int fromIndex = (int) Math.min(pageable.getOffset(), rankedJobs.size());
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), rankedJobs.size());
        List<JobPostResponse> content = rankedJobs.subList(fromIndex, toIndex).stream()
                .map(RankedJob::jobPost)
                .map(JobPostResponse::from)
                .toList();

        return PageResponse.from(new PageImpl<>(content, pageable, rankedJobs.size()));
    }

    private JobMatchingContext buildContext(
            Candidate candidate,
            List<SavedJob> recentSavedJobs,
            List<Application> recentApplications
    ) {
        Set<Long> preferredCategoryIds = Stream.concat(
                        recentSavedJobs.stream().map(savedJob -> savedJob.getJobPost().getCategory()),
                        recentApplications.stream().map(application -> application.getJobPost().getCategory())
                )
                .filter(java.util.Objects::nonNull)
                .map(category -> category.getId())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<String> preferredLocations = Stream.concat(
                        Stream.of(candidate.getAddress()),
                        Stream.concat(
                                recentSavedJobs.stream().map(savedJob -> savedJob.getJobPost().getLocation()),
                                recentApplications.stream().map(application -> application.getJobPost().getLocation())
                        )
                )
                .flatMap(value -> splitTokens(value, 2))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<String> profileKeywords = Stream.concat(
                        Stream.of(candidate.getHeadline(), candidate.getSummary()),
                        Stream.concat(
                                recentSavedJobs.stream().flatMap(savedJob -> Stream.of(
                                        savedJob.getJobPost().getTitle(),
                                        savedJob.getJobPost().getDescription()
                                )),
                                recentApplications.stream().flatMap(application -> Stream.of(
                                        application.getJobPost().getTitle(),
                                        application.getJobPost().getDescription(),
                                        application.getResume() == null ? null : application.getResume().getContent()
                                ))
                        )
                )
                .flatMap(value -> splitTokens(value, 3))
                .limit(50)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<JobLevel> preferredLevels = Stream.concat(
                        recentSavedJobs.stream().map(savedJob -> savedJob.getJobPost().getLevel()),
                        recentApplications.stream().map(application -> application.getJobPost().getLevel())
                )
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<Long> excludedJobIds = recentApplications.stream()
                .map(application -> application.getJobPost().getId())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        return new JobMatchingContext(
                preferredCategoryIds,
                preferredLocations,
                profileKeywords,
                preferredLevels,
                excludedJobIds
        );
    }

    private boolean isEligible(JobPost jobPost, JobMatchingContext context) {
        return !context.excludedJobIds().contains(jobPost.getId())
                && (jobPost.getDeadline() == null || !jobPost.getDeadline().isBefore(LocalDate.now()));
    }

    private double totalScore(Candidate candidate, JobPost jobPost, JobMatchingContext context) {
        double score = jobMatchingStrategies.stream()
                .mapToDouble(strategy -> strategy.score(candidate, jobPost, context))
                .sum();

        if (score == 0.0) {
            score += fallbackFreshnessScore(jobPost);
        }
        return score;
    }

    private double fallbackFreshnessScore(JobPost jobPost) {
        Instant createdAt = safeCreatedAt(jobPost);
        double ageInDays = Math.max(0, (Instant.now().toEpochMilli() - createdAt.toEpochMilli()) / 86_400_000.0);
        return Math.max(0.1, 3.0 - Math.min(ageInDays, 14) * 0.2);
    }

    private Instant safeCreatedAt(JobPost jobPost) {
        return jobPost.getCreatedAt() == null ? Instant.EPOCH : jobPost.getCreatedAt();
    }

    private Stream<String> splitTokens(String value, int minLength) {
        if (value == null || value.isBlank()) {
            return Stream.empty();
        }
        return Arrays.stream(value.toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+"))
                .map(String::trim)
                .filter(token -> token.length() >= minLength)
                .limit(CANDIDATE_HISTORY_LIMIT);
    }

    private record RankedJob(JobPost jobPost, double score) {
    }
}
