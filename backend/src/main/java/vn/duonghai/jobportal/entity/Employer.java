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

/**
 * Ho so doanh nghiep - mo rong 1-1 cua {@link User}.
 * {@code approved} = da duoc Admin duyet hay chua.
 */
@Entity
@Table(name = "employers")
@Getter
@Setter
public class Employer {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "tax_code", length = 50)
    private String taxCode;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(length = 255)
    private String website;

    @Column(name = "company_size", length = 50)
    private String companySize;

    @Column(name = "source_url", length = 500, unique = true)
    private String sourceUrl;

    @Column(length = 255)
    private String address;

    @Column(nullable = false)
    private boolean approved = false;
}
