package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.duonghai.jobportal.enums.NotificationType;
import vn.duonghai.jobportal.service.NotificationChannel;
import vn.duonghai.jobportal.service.NotificationChannelFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationChannelFactoryImpl implements NotificationChannelFactory {

    private final InAppNotificationChannel inAppNotificationChannel;
    private final EmailNotificationChannel emailNotificationChannel;

    @Override
    public List<NotificationChannel> createChannels(NotificationType type) {
        return switch (type) {
            case NEW_JOB, APPLICATION_STATUS -> List.of(inAppNotificationChannel, emailNotificationChannel);
            case SYSTEM -> List.of(inAppNotificationChannel);
        };
    }
}
