package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.request.LoginRequest;
import vn.duonghai.jobportal.dto.request.RegisterRequest;
import vn.duonghai.jobportal.dto.response.AuthResponse;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.UserRepository;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.security.JwtTokenProvider;
import vn.duonghai.jobportal.service.AuthService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Khong the dang ky tai khoan ADMIN cong khai");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(HttpStatus.CONFLICT, "Email da duoc su dung");
        }
        if (request.role() == Role.EMPLOYER && isBlank(request.companyName())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Ten cong ty la bat buoc voi nha tuyen dung");
        }

        var user = new User();
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setPhone(normalizeNullable(request.phone()));
        user.setRole(request.role());
        user.setStatus(request.role() == Role.EMPLOYER ? UserStatus.PENDING : UserStatus.ACTIVE);

        var savedUser = userRepository.save(user);
        createRoleProfile(savedUser, request);
        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().trim().toLowerCase(),
                        request.password()
                )
        );

        var user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Email hoac mat khau khong dung"));
        return buildAuthResponse(user);
    }

    private void createRoleProfile(User user, RegisterRequest request) {
        switch (user.getRole()) {
            case CANDIDATE -> {
                var candidate = new Candidate();
                candidate.setUser(user);
                candidateRepository.save(candidate);
            }
            case EMPLOYER -> {
                var employer = new Employer();
                employer.setUser(user);
                employer.setCompanyName(request.companyName().trim());
                employer.setReviewStatus(EmployerReviewStatus.PENDING);
                employer.setApproved(false);
                employerRepository.save(employer);
            }
            case ADMIN -> throw new BusinessException(HttpStatus.BAD_REQUEST, "Vai tro khong hop le");
        }
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

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
