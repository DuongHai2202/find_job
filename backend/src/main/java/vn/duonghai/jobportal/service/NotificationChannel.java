package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.enums.NotificationType;

public interface NotificationChannel {

    record Message(
            Long userId,
            String recipientEmail,
            NotificationType type,
            String title,
            String content
    ) {
    }

    void send(Message message);
}
