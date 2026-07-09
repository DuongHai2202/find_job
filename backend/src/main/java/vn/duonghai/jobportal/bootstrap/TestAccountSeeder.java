package vn.duonghai.jobportal.bootstrap;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.UserRepository;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class TestAccountSeeder implements CommandLineRunner {

    private static final String DEFAULT_PASSWORD = "123456";

    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (!appProperties.seed()) {
            return;
        }

        ensureAdmin("admin@jobportal.test", "Admin JobPortal");
        ensureCandidate(
                "candidate@jobportal.test",
                "Nguyễn Văn An",
                "Backend Developer Fresher",
                "Ứng viên quan tâm Spring Boot, REST API và SQL."
        );
        ensureCandidate(
                "candidate2@jobportal.test",
                "Trần Minh Châu",
                "Frontend Developer Intern",
                "Ứng viên tập trung React, UI và responsive web."
        );
        ensureEmployer(
                "employer@jobportal.test",
                "Nhân sự FindJob",
                "FindJob Tech",
                "Nền tảng công nghệ kết nối ứng viên và nhà tuyển dụng.",
                "51-200",
                "Hà Nội"
        );
        ensureEmployer(
                "employer2@jobportal.test",
                "Recruiter GreenSoft",
                "GreenSoft Vietnam",
                "Công ty phát triển sản phẩm web và giải pháp doanh nghiệp.",
                "201-500",
                "Đà Nẵng"
        );
    }

    private void ensureAdmin(String email, String fullName) {
        ensureUser(email, fullName, Role.ADMIN, UserStatus.ACTIVE);
    }

    private void ensureCandidate(String email, String fullName, String headline, String summary) {
        User user = ensureUser(email, fullName, Role.CANDIDATE, UserStatus.ACTIVE);
        Candidate candidate = candidateRepository.findById(user.getId()).orElseGet(Candidate::new);
        candidate.setUser(user);
        candidate.setHeadline(headline);
        candidate.setSummary(summary);
        candidateRepository.save(candidate);
    }

    private void ensureEmployer(
            String email,
            String fullName,
            String companyName,
            String companyDescription,
            String companySize,
            String address
    ) {
        User user = ensureUser(email, fullName, Role.EMPLOYER, UserStatus.ACTIVE);
        Employer employer = employerRepository.findById(user.getId()).orElseGet(Employer::new);
        employer.setUser(user);
        employer.setCompanyName(companyName);
        employer.setCompanyDescription(companyDescription);
        employer.setCompanySize(companySize);
        employer.setAddress(address);
        employer.setReviewStatus(EmployerReviewStatus.APPROVED);
        employer.setApproved(true);
        employerRepository.save(employer);
    }

    private User ensureUser(String email, String fullName, Role role, UserStatus status) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setRole(role);
        user.setStatus(status);
        user.setPasswordHash(passwordEncoder.encode(DEFAULT_PASSWORD));
        return userRepository.save(user);
    }
}
