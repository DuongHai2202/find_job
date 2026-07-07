package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.service.NotificationChannel;

@Component
@Slf4j
@RequiredArgsConstructor
public class EmailNotificationChannel implements NotificationChannel {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Override
    public void send(Message message) {
        if (message.recipientEmail() == null || message.recipientEmail().isBlank()) {
            return;
        }
        var mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.info("Bo qua gui email thong bao vi chua cau hinh JavaMailSender");
            return;
        }

        var mail = new SimpleMailMessage();
        mail.setTo(message.recipientEmail());
        mail.setSubject(message.title());
        mail.setText(message.content());

        try {
            mailSender.send(mail);
        } catch (MailException ex) {
            log.warn("Khong gui duoc email thong bao den {}: {}", message.recipientEmail(), ex.getMessage());
        }
    }
}
