package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.enums.NotificationType;

import java.util.List;

public interface NotificationChannelFactory {

    List<NotificationChannel> createChannels(NotificationType type);
}
