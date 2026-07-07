package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Ho so ung vien - mo rong 1-1 cua {@link User} (kE thua trong thiet ke OO).
 * Khoa chinh dung chung user_id (@MapsId).
 */
@Entity
@Table(name = "candidates")
@Getter
@Setter
public class Candidate {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @Column(length = 255)
    private String address;

    @Column(length = 255)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String summary;
}
