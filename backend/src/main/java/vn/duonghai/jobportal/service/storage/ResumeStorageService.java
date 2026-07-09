package vn.duonghai.jobportal.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import vn.duonghai.jobportal.entity.Resume;

public interface ResumeStorageService {

    String provider();

    StoredResumeFile upload(MultipartFile file, String originalFileName);

    Resource loadAsResource(Resume resume);

    void delete(Resume resume);
}
