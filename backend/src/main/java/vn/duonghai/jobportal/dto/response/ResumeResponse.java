package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Resume;

import java.time.Instant;

public record ResumeResponse(
        Long id,
        String title,
        String fileUrl,
        String originalFileName,
        String mimeType,
        Long sizeInBytes,
        String storageProvider,
        String content,
        Instant createdAt,
        Instant updatedAt
) {

    public static ResumeResponse from(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getFileUrl(),
                resume.getOriginalFileName(),
                resume.getMimeType(),
                resume.getSizeInBytes(),
                resume.getStorageProvider(),
                resume.getContent(),
                resume.getCreatedAt(),
                resume.getUpdatedAt()
        );
    }
}