package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.response.AuthResponse;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.UserRepository;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.security.GoogleOAuth2ErrorCodes;
import vn.duonghai.jobportal.security.JwtTokenProvider;
import vn.duonghai.jobportal.service.GoogleOAuth2Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoogleOAuth2ServiceImpl implements GoogleOAuth2Service {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse login(String subject, String email, String fullName, boolean emailVerified) {
        if (subject == null || subject.isBlank() || email == null || email.isBlank()) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, GoogleOAuth2ErrorCodes.GOOGLE_ACCOUNT_INCOMPLETE);
        }
        if (!emailVerified) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, GoogleOAuth2ErrorCodes.GOOGLE_EMAIL_UNVERIFIED);
        }

        var normalizedEmail = email.trim().toLowerCase();
        var normalizedFullName = normalizeName(fullName);
        var user = userRepository.findByGoogleSubject(subject)
                .orElseGet(() -> userRepository.findByEmail(normalizedEmail)
                        .map(existing -> linkGoogleAccount(existing, subject, normalizedFullName))
                        .orElseGet(() -> createCandidateFromGoogle(subject, normalizedEmail, normalizedFullName)));

        if (user.getRole() != Role.CANDIDATE) {
            throw new BusinessException(HttpStatus.FORBIDDEN, GoogleOAuth2ErrorCodes.GOOGLE_ROLE_NOT_ALLOWED);
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(HttpStatus.FORBIDDEN, GoogleOAuth2ErrorCodes.GOOGLE_ACCOUNT_NOT_ACTIVE);
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        var principal = AuthenticatedUser.from(user);
        var token = jwtTokenProvider.createToken(principal);
        var userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus()
        );
        return new AuthResponse(token, jwtTokenProvider.expirationMs(), userInfo);
    }

    private User linkGoogleAccount(User user, String googleSubject, String fullName) {
        if (user.getRole() != Role.CANDIDATE) {
            throw new BusinessException(HttpStatus.FORBIDDEN, GoogleOAuth2ErrorCodes.GOOGLE_ROLE_NOT_ALLOWED);
        }
        user.setGoogleSubject(googleSubject);
        if (isBlank(user.getFullName())) {
            user.setFullName(fullName);
        }
        return userRepository.save(user);
    }

    private User createCandidateFromGoogle(String subject, String email, String fullName) {
        var user = new User();
        user.setEmail(email);
        user.setGoogleSubject(subject);
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setFullName(fullName);
        user.setRole(Role.CANDIDATE);
        user.setStatus(UserStatus.ACTIVE);

        var savedUser = userRepository.save(user);
        var candidate = new Candidate();
        candidate.setUser(savedUser);
        candidateRepository.save(candidate);
        return savedUser;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String normalizeName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return "Tai khoan Google";
        }
        return fullName.trim();
    }
}
