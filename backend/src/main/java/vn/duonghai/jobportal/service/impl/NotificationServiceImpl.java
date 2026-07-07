package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.response.NotificationResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.entity.Notification;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.NotificationType;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.NotificationRepository;
import vn.duonghai.jobportal.repository.UserRepository;
import vn.duonghai.jobportal.service.PageableSupport;
import vn.duonghai.jobportal.service.NotificationService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<NotificationResponse> getMyNotifications(Long userId, int page, int size) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationResponse::from);
        return PageResponse.from(resultPage);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay thong bao"));
        notification.setRead(true);
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    @Override
    public long countUnread(Long userId) {
        return notificationRepository.countByUser_IdAndReadIsFalse(userId);
    }

    @Override
    @Transactional
    public void createNotification(Long userId, NotificationType type, String title, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay nguoi dung nhan thong bao"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setContent(content);
        notificationRepository.save(notification);
    }
}
