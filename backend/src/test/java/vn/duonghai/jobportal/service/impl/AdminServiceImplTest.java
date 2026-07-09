package vn.duonghai.jobportal.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;
import vn.duonghai.jobportal.enums.NotificationType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.UserRepository;
import vn.duonghai.jobportal.service.NotificationService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void reviewEmployer_shouldMarkRejectedAndLockUser() {
        var employer = employer(10L, "company@test.dev", UserStatus.PENDING, EmployerReviewStatus.PENDING, false);
        when(employerRepository.findById(10L)).thenReturn(Optional.of(employer));
        when(employerRepository.save(any(Employer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = adminService.reviewEmployer(10L, EmployerReviewStatus.REJECTED);

        assertEquals(EmployerReviewStatus.REJECTED, response.reviewStatus());
        assertEquals(UserStatus.LOCKED, response.userStatus());
        verify(notificationService).createNotification(
                eq(10L),
                eq(NotificationType.SYSTEM),
                eq("Tai khoan doanh nghiep da bi tu choi"),
                any(String.class)
        );
    }

    @Test
    void updateUserStatus_shouldRejectSelfLock() {
        var user = adminUser(99L, UserStatus.ACTIVE);
        when(userRepository.findById(99L)).thenReturn(Optional.of(user));

        assertThrows(BusinessException.class, () -> adminService.updateUserStatus(99L, 99L, UserStatus.LOCKED));
    }

    @Test
    void updateUserStatus_shouldRejectLockingLastActiveAdmin() {
        var user = adminUser(88L, UserStatus.ACTIVE);
        when(userRepository.findById(88L)).thenReturn(Optional.of(user));
        when(userRepository.countByRoleAndStatus(Role.ADMIN, UserStatus.ACTIVE)).thenReturn(1L);

        assertThrows(BusinessException.class, () -> adminService.updateUserStatus(99L, 88L, UserStatus.LOCKED));
        verify(userRepository, never()).save(any(User.class));
    }

    private Employer employer(
            Long userId,
            String email,
            UserStatus userStatus,
            EmployerReviewStatus reviewStatus,
            boolean approved
    ) {
        var user = new User();
        user.setId(userId);
        user.setEmail(email);
        user.setFullName("Employer Test");
        user.setRole(Role.EMPLOYER);
        user.setStatus(userStatus);

        var employer = new Employer();
        employer.setUserId(userId);
        employer.setUser(user);
        employer.setCompanyName("Company Test");
        employer.setReviewStatus(reviewStatus);
        employer.setApproved(approved);
        return employer;
    }

    private User adminUser(Long userId, UserStatus status) {
        var user = new User();
        user.setId(userId);
        user.setEmail("admin@test.dev");
        user.setRole(Role.ADMIN);
        user.setStatus(status);
        return user;
    }
}
