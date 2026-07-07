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
import vn.duonghai.jobportal.enums.NotificationType;
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
        var resultPage = employerRepository.findByApproved(false, pageable)
                .map(AdminEmployerResponse::from);
        return PageResponse.from(resultPage);
    }

    @Override
    @Transactional
    public AdminEmployerResponse reviewEmployer(Long employerUserId, boolean approved) {
        Employer employer = employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay doanh nghiep"));

        employer.setApproved(approved);
        employer.getUser().setStatus(approved ? UserStatus.ACTIVE : UserStatus.LOCKED);
        Employer saved = employerRepository.save(employer);

        notificationService.createNotification(
                saved.getUserId(),
                NotificationType.SYSTEM,
                approved ? "Tai khoan doanh nghiep da duoc duyet" : "Tai khoan doanh nghiep chua duoc duyet",
                approved
                        ? "Doanh nghiep cua ban da duoc kich hoat va co the dang tin tuyen dung."
                        : "Doanh nghiep cua ban chua duoc duyet. Vui long lien he quan tri vien neu can ho tro."
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
    public AdminUserResponse updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay nguoi dung"));
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
