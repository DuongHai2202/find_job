package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.JobPost;

public interface NotificationEventPublisher {

    void publishJobApproved(JobPost jobPost);

    void publishApplicationStatusChanged(Application application);
}
