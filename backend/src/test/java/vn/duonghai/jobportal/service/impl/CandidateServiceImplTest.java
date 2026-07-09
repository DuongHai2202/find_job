package vn.duonghai.jobportal.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Resume;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.ResumeRepository;
import vn.duonghai.jobportal.service.storage.LocalResumeStorageService;
import vn.duonghai.jobportal.service.storage.ResumeStorageRegistry;

import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CandidateServiceImplTest {

    @Mock
    private CandidateRepository candidateRepository;
    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private ApplicationRepository applicationRepository;

    @TempDir
    Path tempDir;

    private CandidateServiceImpl candidateService;

    @BeforeEach
    void setUp() {
        var appProperties = new AppProperties(
                new AppProperties.Jwt("secret-secret-secret-secret-secret-secret", "issuer", "audience", 1000L),
                new AppProperties.Cors(java.util.List.of("http://localhost:5173")),
                new AppProperties.Upload(
                        tempDir.toString(),
                        "LOCAL",
                        new AppProperties.Cloudinary(null, null, null, null)
                ),
                new AppProperties.Google("test-google-client-id", "test-google-client-secret", "http://localhost:5173/auth/callback", "http://localhost:5173/login"),
                new AppProperties.AdminBootstrap(false, null, null, null),
                false
        );

        var storageRegistry = new ResumeStorageRegistry(java.util.List.of(
                new LocalResumeStorageService(appProperties)
        ));

        candidateService = new CandidateServiceImpl(
                candidateRepository,
                resumeRepository,
                applicationRepository,
                appProperties,
                storageRegistry
        );
    }

    @Test
    void uploadResume_shouldAcceptPdfExtensionEvenWhenContentTypeMissing() {
        var candidate = candidate(10L);
        when(candidateRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(resumeRepository.save(any(Resume.class))).thenAnswer(invocation -> {
            var resume = invocation.getArgument(0, Resume.class);
            if (resume.getId() == null) {
                resume.setId(99L);
            }
            return resume;
        });

        var file = new MockMultipartFile(
                "file",
                "cv.pdf",
                null,
                "fake pdf content".getBytes()
        );

        var response = candidateService.uploadResume(10L, "CV Backend", "content", file);

        assertEquals("CV Backend", response.title());
        assertEquals("/api/v1/resumes/99/download", response.fileUrl());
    }

    private Candidate candidate(Long userId) {
        var user = new User();
        user.setId(userId);
        user.setRole(Role.CANDIDATE);
        user.setEmail("candidate@test.dev");

        var candidate = new Candidate();
        candidate.setUserId(userId);
        candidate.setUser(user);
        return candidate;
    }
}
