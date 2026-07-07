package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.enums.NotificationType;
import vn.duonghai.jobportal.repository.CompanyFollowRepository;
import vn.duonghai.jobportal.service.NotificationChannel;
import vn.duonghai.jobportal.service.NotificationChannelFactory;
import vn.duonghai.jobportal.service.NotificationEventPublisher;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationEventPublisherImpl implements NotificationEventPublisher {

    private final CompanyFollowRepository companyFollowRepository;
    private final NotificationChannelFactory notificationChannelFactory;

    @Override
    public void publishJobApproved(JobPost jobPost) {
        var title = "Cong ty ban theo doi vua co tin moi";
        var content = jobPost.getEmployer().getCompanyName() + " vua co tin: " + jobPost.getTitle();
        var channels = notificationChannelFactory.createChannels(NotificationType.NEW_JOB);

        for (var follow : companyFollowRepository.findByEmployer(jobPost.getEmployer())) {
            var message = new NotificationChannel.Message(
                    follow.getCandidate().getUserId(),
                    follow.getCandidate().getUser().getEmail(),
                    NotificationType.NEW_JOB,
                    title,
                    content
            );
            channels.forEach(channel -> channel.send(message));
        }
    }

    @Override
    public void publishApplicationStatusChanged(Application application) {
        var message = new NotificationChannel.Message(
                application.getCandidate().getUserId(),
                application.getCandidate().getUser().getEmail(),
                NotificationType.APPLICATION_STATUS,
                "Trang thai ho so da thay doi",
                "Ho so cua ban cho tin '" + application.getJobPost().getTitle() + "' da duoc cap nhat thanh "
                        + application.getStatus().name()
        );

        notificationChannelFactory.createChannels(NotificationType.APPLICATION_STATUS)
                .forEach(channel -> channel.send(message));
    }
}
