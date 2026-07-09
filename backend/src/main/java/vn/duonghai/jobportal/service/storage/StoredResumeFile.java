package vn.duonghai.jobportal.service.storage;

public record StoredResumeFile(
        String storedFileName,
        String externalFileUrl,
        String storageProvider
) {
}
