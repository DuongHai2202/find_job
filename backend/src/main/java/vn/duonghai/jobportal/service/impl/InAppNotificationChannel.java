package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.service.NotificationChannel;
import vn.duonghai.jobportal.service.NotificationService;

@Component
@RequiredArgsConstructor
public class InAppNotificationChannel implements NotificationChannel {

    private final NotificationService notificationService;

    @Override
    public void send(Message message) {
        notificationService.createNotification(
                message.userId(),
                message.type(),
                message.title(),
                message.content()
        );
    }
}
