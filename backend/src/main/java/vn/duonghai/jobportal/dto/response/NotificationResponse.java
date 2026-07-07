package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Notification;
import vn.duonghai.jobportal.enums.NotificationType;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String title,
        String content,
        boolean read,
        Instant createdAt
) {

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getContent(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}