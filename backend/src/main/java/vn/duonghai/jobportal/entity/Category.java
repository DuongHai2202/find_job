package vn.duonghai.jobportal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Nhom nganh nghe. Co the long nhau qua {@code parent} (danh muc cha). */
@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;
}
