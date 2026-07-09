package vn.duonghai.jobportal.bootstrap;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.UserRepository;

@Component
@Order(1)
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        AppProperties.AdminBootstrap adminBootstrap = appProperties.adminBootstrap();
        if (adminBootstrap == null || !adminBootstrap.enabled()) {
            return;
        }

        if (userRepository.countByRole(Role.ADMIN) > 0) {
            return;
        }

        String email = normalizeEmail(adminBootstrap.email());
        String password = adminBootstrap.password();
        String fullName = normalizeFullName(adminBootstrap.fullName());

        if (email == null) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "APP_BOOTSTRAP_ADMIN_EMAIL khong duoc de trong");
        }
        if (password == null || password.isBlank()) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "APP_BOOTSTRAP_ADMIN_PASSWORD khong duoc de trong");
        }

        var existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            if (existingUser.get().getRole() != Role.ADMIN) {
                throw new BusinessException(HttpStatus.CONFLICT, "Email bootstrap admin da thuoc ve mot tai khoan khac");
            }
            return;
        }

        User admin = new User();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setFullName(fullName);
        admin.setRole(Role.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        userRepository.save(admin);
    }

    private String normalizeEmail(String value) {
        return value == null || value.isBlank() ? null : value.trim().toLowerCase();
    }

    private String normalizeFullName(String value) {
        return value == null || value.isBlank() ? "Admin JobPortal" : value.trim();
    }
}
