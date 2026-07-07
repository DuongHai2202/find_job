package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.duonghai.jobportal.enums.NotificationType;

/** Thong bao in-app gui den nguoi dung (ket qua cua Observer). */
@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private NotificationType type;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;
}
