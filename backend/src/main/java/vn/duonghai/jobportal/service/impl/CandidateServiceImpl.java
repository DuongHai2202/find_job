package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.dto.request.CandidateProfileRequest;
import vn.duonghai.jobportal.dto.request.ResumeRequest;
import vn.duonghai.jobportal.dto.response.CandidateProfileResponse;
import vn.duonghai.jobportal.dto.response.ResumeResponse;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Resume;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.ResumeRepository;
import vn.duonghai.jobportal.service.CandidateService;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CandidateServiceImpl implements CandidateService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("application/pdf");
    private static final String STORAGE_PROVIDER = "LOCAL";

    private final CandidateRepository candidateRepository;
    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;
    private final AppProperties appProperties;

    @Override
    public CandidateProfileResponse getMyProfile(Long candidateUserId) {
        return CandidateProfileResponse.from(getCandidateOrThrow(candidateUserId));
    }

    @Override
    @Transactional
    public CandidateProfileResponse updateMyProfile(Long candidateUserId, CandidateProfileRequest request) {
        Candidate candidate = getCandidateOrThrow(candidateUserId);
        candidate.getUser().setFullName(normalizeNullable(request.fullName()));
        candidate.getUser().setPhone(normalizeNullable(request.phone()));
        candidate.setDateOfBirth(request.dateOfBirth());
        candidate.setGender(normalizeNullable(request.gender()));
        candidate.setAddress(normalizeNullable(request.address()));
        candidate.setHeadline(normalizeNullable(request.headline()));
        candidate.setSummary(normalizeNullable(request.summary()));
        return CandidateProfileResponse.from(candidateRepository.save(candidate));
    }

    @Override
    public List<ResumeResponse> getMyResumes(Long candidateUserId) {
        getCandidateOrThrow(candidateUserId);
        return resumeRepository.findByCandidate_UserIdOrderByCreatedAtDesc(candidateUserId).stream()
                .map(ResumeResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ResumeResponse createResume(Long candidateUserId, ResumeRequest request) {
        Candidate candidate = getCandidateOrThrow(candidateUserId);
        Resume resume = new Resume();
        resume.setCandidate(candidate);
        applyResumeData(resume, request);
        return ResumeResponse.from(resumeRepository.save(resume));
    }

    @Override
    @Transactional
    public ResumeResponse uploadResume(Long candidateUserId, String title, String content, MultipartFile file) {
        Candidate candidate = getCandidateOrThrow(candidateUserId);
        if (title == null || title.isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Tieu de CV khong duoc de trong");
        }
        validateFile(file);

        String originalName = sanitizeOriginalFileName(file.getOriginalFilename());
        String storedFileName = UUID.randomUUID() + ".pdf";
        storeResumeFile(file, storedFileName);

        Resume resume = new Resume();
        resume.setCandidate(candidate);
        resume.setTitle(title.trim());
        resume.setContent(normalizeNullable(content));
        resume.setOriginalFileName(originalName);
        resume.setStoredFileName(storedFileName);
        resume.setMimeType(file.getContentType());
        resume.setSizeInBytes(file.getSize());
        resume.setStorageProvider(STORAGE_PROVIDER);

        Resume savedResume = resumeRepository.save(resume);
        savedResume.setFileUrl(buildDownloadUrl(savedResume.getId()));
        return ResumeResponse.from(resumeRepository.save(savedResume));
    }

    @Override
    @Transactional
    public ResumeResponse updateResume(Long candidateUserId, Long resumeId, ResumeRequest request) {
        Resume resume = resumeRepository.findByIdAndCandidate_UserId(resumeId, candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay CV"));
        applyResumeData(resume, request);
        return ResumeResponse.from(resumeRepository.save(resume));
    }

    @Override
    @Transactional
    public void deleteResume(Long candidateUserId, Long resumeId) {
        Resume resume = resumeRepository.findByIdAndCandidate_UserId(resumeId, candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay CV"));
        if (applicationRepository.existsByResume_Id(resumeId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Khong the xoa CV dang duoc su dung trong ho so ung tuyen");
        }
        deleteStoredResumeFile(resume.getStoredFileName());
        resumeRepository.delete(resume);
    }

    @Override
    public ResumeDownload downloadResume(Long actorUserId, Role actorRole, Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay CV"));

        if (!canAccessResume(actorUserId, actorRole, resume)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Ban khong co quyen truy cap CV nay");
        }

        return new ResumeDownload(
                loadResumeAsResource(resume.getStoredFileName()),
                resume.getOriginalFileName() == null ? "resume.pdf" : resume.getOriginalFileName(),
                resume.getMimeType() == null ? "application/pdf" : resume.getMimeType()
        );
    }

    private void applyResumeData(Resume resume, ResumeRequest request) {
        resume.setTitle(request.title().trim());
        resume.setFileUrl(normalizeNullable(request.fileUrl()));
        resume.setContent(normalizeNullable(request.content()));
    }

    private boolean canAccessResume(Long actorUserId, Role actorRole, Resume resume) {
        if (actorRole == Role.ADMIN) {
            return true;
        }
        if (actorRole == Role.CANDIDATE) {
            return resume.getCandidate().getUserId().equals(actorUserId);
        }
        return actorRole == Role.EMPLOYER
                && applicationRepository.existsByResume_IdAndJobPost_Employer_UserId(resume.getId(), actorUserId);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "File CV khong duoc de trong");
        }
        String contentType = file.getContentType();
        boolean hasAllowedContentType = contentType != null && ALLOWED_CONTENT_TYPES.contains(contentType);
        String originalFileName = file.getOriginalFilename();
        boolean hasPdfExtension = originalFileName != null && originalFileName.toLowerCase().endsWith(".pdf");
        if (!hasAllowedContentType && !hasPdfExtension) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Chi chap nhan file PDF cho CV");
        }
    }

    private void storeResumeFile(MultipartFile file, String storedFileName) {
        createResumeDirectory();
        Path target = getResumeDirectory().resolve(storedFileName).normalize();
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the luu file CV vao bo nho local");
        }
    }

    private Resource loadResumeAsResource(String storedFileName) {
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

    private void deleteStoredResumeFile(String storedFileName) {
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

    private String sanitizeOriginalFileName(String originalFileName) {
        if (originalFileName == null || originalFileName.isBlank()) {
            return "resume.pdf";
        }
        return Paths.get(originalFileName).getFileName().toString();
    }

    private Candidate getCandidateOrThrow(Long candidateUserId) {
        return candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
    }

    private String buildDownloadUrl(Long resumeId) {
        return "/api/v1/resumes/" + resumeId + "/download";
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
