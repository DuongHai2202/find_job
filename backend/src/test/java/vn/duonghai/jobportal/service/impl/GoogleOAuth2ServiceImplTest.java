package vn.duonghai.jobportal.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.UserRepository;
import vn.duonghai.jobportal.security.GoogleOAuth2ErrorCodes;
import vn.duonghai.jobportal.security.JwtTokenProvider;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoogleOAuth2ServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private CandidateRepository candidateRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    private GoogleOAuth2ServiceImpl googleOAuth2Service;

    @BeforeEach
    void setUp() {
        var appProperties = new AppProperties(
                new AppProperties.Jwt("secret-secret-secret-secret-secret-secret", "issuer", "audience", 1000L),
                new AppProperties.Cors(List.of("http://localhost:5173")),
                new AppProperties.Upload(
                        "uploads",
                        "LOCAL",
                        new AppProperties.Cloudinary(null, null, null, null)
                ),
                new AppProperties.Google(
                        "test-google-client-id",
                        "test-google-client-secret",
                        "http://localhost:5173/auth/callback",
                        "http://localhost:5173/login"
                ),
                new AppProperties.AdminBootstrap(false, null, null, null),
                false
        );

        googleOAuth2Service = new GoogleOAuth2ServiceImpl(
                userRepository,
                candidateRepository,
                passwordEncoder,
                new JwtTokenProvider(appProperties)
        );
    }

    @Test
    void login_shouldCreateCandidateForNewGoogleAccount() {
        when(userRepository.findByGoogleSubject("google-sub")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("candidate@test.dev")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("encoded-random-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            var user = invocation.getArgument(0, User.class);
            if (user.getId() == null) {
                user.setId(55L);
            }
            return user;
        });
        when(candidateRepository.save(any(Candidate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = googleOAuth2Service.login(
                "google-sub",
                "candidate@test.dev",
                "Candidate Google",
                true
        );

        assertEquals("candidate@test.dev", response.user().email());
        assertEquals(Role.CANDIDATE, response.user().role());
        assertEquals(UserStatus.ACTIVE, response.user().status());
        verify(candidateRepository).save(any(Candidate.class));
    }

    @Test
    void login_shouldLinkExistingCandidate() {
        var existingUser = user(77L, "candidate@test.dev", Role.CANDIDATE, UserStatus.ACTIVE);
        when(userRepository.findByGoogleSubject("google-sub")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("candidate@test.dev")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = googleOAuth2Service.login(
                "google-sub",
                "candidate@test.dev",
                "Candidate Google",
                true
        );

        assertEquals(77L, response.user().id());
        assertEquals("google-sub", existingUser.getGoogleSubject());
        verify(candidateRepository, never()).save(any(Candidate.class));
    }

    @Test
    void login_shouldRejectUnverifiedEmail() {
        var exception = assertThrows(BusinessException.class, () ->
                googleOAuth2Service.login("google-sub", "candidate@test.dev", "Candidate", false)
        );

        assertEquals(GoogleOAuth2ErrorCodes.GOOGLE_EMAIL_UNVERIFIED, exception.getMessage());
    }

    @Test
    void login_shouldRejectIncompleteGoogleAccount() {
        var exception = assertThrows(BusinessException.class, () ->
                googleOAuth2Service.login(" ", "candidate@test.dev", "Candidate", true)
        );

        assertEquals(GoogleOAuth2ErrorCodes.GOOGLE_ACCOUNT_INCOMPLETE, exception.getMessage());
    }

    @Test
    void login_shouldRejectExistingEmployerOrAdmin() {
        var existingEmployer = user(88L, "employer@test.dev", Role.EMPLOYER, UserStatus.ACTIVE);
        when(userRepository.findByGoogleSubject("google-sub")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("employer@test.dev")).thenReturn(Optional.of(existingEmployer));

        var exception = assertThrows(BusinessException.class, () ->
                googleOAuth2Service.login("google-sub", "employer@test.dev", "Employer", true)
        );

        assertEquals(GoogleOAuth2ErrorCodes.GOOGLE_ROLE_NOT_ALLOWED, exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_shouldRejectLockedCandidate() {
        var lockedCandidate = user(99L, "locked@test.dev", Role.CANDIDATE, UserStatus.LOCKED);
        when(userRepository.findByGoogleSubject("google-sub")).thenReturn(Optional.of(lockedCandidate));

        var exception = assertThrows(BusinessException.class, () ->
                googleOAuth2Service.login("google-sub", "locked@test.dev", "Locked Candidate", true)
        );

        assertEquals(GoogleOAuth2ErrorCodes.GOOGLE_ACCOUNT_NOT_ACTIVE, exception.getMessage());
    }

    private User user(Long id, String email, Role role, UserStatus status) {
        var user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFullName("OAuth User");
        user.setPasswordHash("encoded");
        user.setRole(role);
        user.setStatus(status);
        return user;
    }
}
