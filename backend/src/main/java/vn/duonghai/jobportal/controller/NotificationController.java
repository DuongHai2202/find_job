package vn.duonghai.jobportal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.dto.response.NotificationResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.security.AuthenticatedUser;
import vn.duonghai.jobportal.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public PageResponse<NotificationResponse> getMyNotifications(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return notificationService.getMyNotifications(currentUser.id(), page, size);
    }

    @PatchMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable Long notificationId
    ) {
        return notificationService.markAsRead(currentUser.id(), notificationId);
    }

    @GetMapping("/unread-count")
    public long countUnread(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return notificationService.countUnread(currentUser.id());
    }
}
