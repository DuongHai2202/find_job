package vn.duonghai.jobportal.service.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.Resume;
import vn.duonghai.jobportal.exception.BusinessException;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalResumeStorageService implements ResumeStorageService {

    public static final String PROVIDER = "LOCAL";

    private final AppProperties appProperties;

    @Override
    public String provider() {
        return PROVIDER;
    }

    @Override
    public StoredResumeFile upload(MultipartFile file, String originalFileName) {
        createResumeDirectory();
        String storedFileName = UUID.randomUUID() + ".pdf";
        Path target = getResumeDirectory().resolve(storedFileName).normalize();
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
            return new StoredResumeFile(storedFileName, null, PROVIDER);
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the luu file CV vao bo nho local");
        }
    }

    @Override
    public Resource loadAsResource(Resume resume) {
        String storedFileName = resume.getStoredFileName();
        if (storedFileName == null || storedFileName.isBlank()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "CV nay khong co file luu tru");
        }
        try {
            Resource resource = new UrlResource(getResumeDirectory().resolve(storedFileName).normalize().toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay file CV tren bo nho");
            }
            return resource;
        } catch (MalformedURLException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the doc file CV");
        }
    }

    @Override
    public void delete(Resume resume) {
        String storedFileName = resume.getStoredFileName();
        if (storedFileName == null || storedFileName.isBlank()) {
            return;
        }
        try {
            Files.deleteIfExists(getResumeDirectory().resolve(storedFileName).normalize());
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the xoa file CV local");
        }
    }

    private void createResumeDirectory() {
        try {
            Files.createDirectories(getResumeDirectory());
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the khoi tao thu muc luu CV");
        }
    }

    private Path getResumeDirectory() {
        return Paths.get(appProperties.upload().dir()).toAbsolutePath().normalize().resolve("resumes");
    }
}
