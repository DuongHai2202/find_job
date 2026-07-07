package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Tag phuc vu tim kiem, loc va gan metadata cho job crawl/import. */
@Entity
@Table(name = "tags")
@Getter
@Setter
public class Tag extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "normalized_name", nullable = false, unique = true, length = 120)
    private String normalizedName;
}
