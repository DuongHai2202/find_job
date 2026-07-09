package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.response.AdminEmployerResponse;
import vn.duonghai.jobportal.dto.response.AdminUserResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.EmployerReviewStatus;
import vn.duonghai.jobportal.enums.NotificationType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.UserRepository;
import vn.duonghai.jobportal.service.AdminService;
import vn.duonghai.jobportal.service.NotificationService;
import vn.duonghai.jobportal.service.PageableSupport;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public PageResponse<AdminEmployerResponse> getPendingEmployers(int page, int size) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.ASC, "user.createdAt"));
        var resultPage = employerRepository.findByReviewStatus(EmployerReviewStatus.PENDING, pageable)
                .map(AdminEmployerResponse::from);
        return PageResponse.from(resultPage);
    }

    @Override
    @Transactional
    public AdminEmployerResponse reviewEmployer(Long employerUserId, EmployerReviewStatus status) {
        if (status != EmployerReviewStatus.APPROVED && status != EmployerReviewStatus.REJECTED) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Chi cho phep duyet hoac tu choi doanh nghiep");
        }

        Employer employer = employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay doanh nghiep"));

        employer.setReviewStatus(status);
        employer.setApproved(status == EmployerReviewStatus.APPROVED);
        employer.getUser().setStatus(status == EmployerReviewStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.LOCKED);
        Employer saved = employerRepository.save(employer);

        notificationService.createNotification(
                saved.getUserId(),
                NotificationType.SYSTEM,
                status == EmployerReviewStatus.APPROVED
                        ? "Tai khoan doanh nghiep da duoc duyet"
                        : "Tai khoan doanh nghiep da bi tu choi",
                status == EmployerReviewStatus.APPROVED
                        ? "Doanh nghiep cua ban da duoc kich hoat va co the dang tin tuyen dung."
                        : "Doanh nghiep cua ban chua duoc phe duyet. Vui long lien he quan tri vien neu can ho tro."
        );

        return AdminEmployerResponse.from(saved);
    }

    @Override
    public PageResponse<AdminUserResponse> getUsers(int page, int size) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = userRepository.findAll(pageable)
                .map(AdminUserResponse::from);
        return PageResponse.from(resultPage);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserStatus(Long actorUserId, Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay nguoi dung"));

        if (status == UserStatus.LOCKED && actorUserId.equals(userId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Khong the tu khoa tai khoan admin dang su dung");
        }

        if (status == UserStatus.LOCKED
                && user.getRole() == Role.ADMIN
                && user.getStatus() == UserStatus.ACTIVE
                && userRepository.countByRoleAndStatus(Role.ADMIN, UserStatus.ACTIVE) <= 1) {
            throw new BusinessException(HttpStatus.CONFLICT, "Khong the khoa admin active cuoi cung");
        }

        user.setStatus(status);
        User saved = userRepository.save(user);

        notificationService.createNotification(
                saved.getId(),
                NotificationType.SYSTEM,
                "Trang thai tai khoan da thay doi",
                "Tai khoan cua ban da duoc cap nhat thanh " + status.name()
        );

        return AdminUserResponse.from(saved);
    }
}
