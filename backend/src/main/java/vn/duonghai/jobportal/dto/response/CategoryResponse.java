package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Category;

import java.time.Instant;

public record CategoryResponse(
        Long id,
        String name,
        Long parentId,
        String parentName,
        Instant createdAt,
        Instant updatedAt
) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getParent() == null ? null : category.getParent().getId(),
                category.getParent() == null ? null : category.getParent().getName(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
