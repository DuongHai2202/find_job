package vn.duonghai.jobportal.bootstrap;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminBootstrapRunnerTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminBootstrapRunner runner;

    @Test
    void run_shouldCreateAdminWhenEnabledAndMissing() {
        var appProperties = appProperties(true, "admin@jobportal.test", "123456", "Admin JobPortal");
        runner = new AdminBootstrapRunner(appProperties, userRepository, passwordEncoder);

        when(userRepository.countByRole(Role.ADMIN)).thenReturn(0L);
        when(userRepository.findByEmail("admin@jobportal.test")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("123456")).thenReturn("hashed-password");

        runner.run();

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals(Role.ADMIN, captor.getValue().getRole());
        assertEquals(UserStatus.ACTIVE, captor.getValue().getStatus());
        assertEquals("hashed-password", captor.getValue().getPasswordHash());
    }

    @Test
    void run_shouldFailWhenEmailBelongsToNonAdmin() {
        var appProperties = appProperties(true, "admin@jobportal.test", "123456", "Admin JobPortal");
        runner = new AdminBootstrapRunner(appProperties, userRepository, passwordEncoder);

        var existing = new User();
        existing.setEmail("admin@jobportal.test");
        existing.setRole(Role.CANDIDATE);

        when(userRepository.countByRole(Role.ADMIN)).thenReturn(0L);
        when(userRepository.findByEmail("admin@jobportal.test")).thenReturn(Optional.of(existing));

        assertThrows(BusinessException.class, () -> runner.run());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void run_shouldSkipWhenSystemAlreadyHasAdmin() {
        var appProperties = appProperties(true, "admin@jobportal.test", "123456", "Admin JobPortal");
        runner = new AdminBootstrapRunner(appProperties, userRepository, passwordEncoder);

        when(userRepository.countByRole(Role.ADMIN)).thenReturn(1L);

        runner.run();

        verify(userRepository, never()).findByEmail(any(String.class));
        verify(userRepository, never()).save(any(User.class));
    }

    private AppProperties appProperties(boolean enabled, String email, String password, String fullName) {
        return new AppProperties(
                new AppProperties.Jwt("secret-secret-secret-secret-secret-secret", "issuer", "audience", 1000L),
                new AppProperties.Cors(List.of("http://localhost:5173")),
                new AppProperties.Upload(
                        "uploads",
                        "LOCAL",
                        new AppProperties.Cloudinary(null, null, null, null)
                ),
                new AppProperties.Google("google-client-id", "google-client-secret", "http://localhost:5173/auth/callback", "http://localhost:5173/login"),
                new AppProperties.AdminBootstrap(enabled, email, password, fullName),
                false
        );
    }
}
