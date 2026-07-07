package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.response.NotificationResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.enums.NotificationType;

public interface NotificationService {

    PageResponse<NotificationResponse> getMyNotifications(Long userId, int page, int size);

    NotificationResponse markAsRead(Long userId, Long notificationId);

    long countUnread(Long userId);

    void createNotification(Long userId, NotificationType type, String title, String content);
}
