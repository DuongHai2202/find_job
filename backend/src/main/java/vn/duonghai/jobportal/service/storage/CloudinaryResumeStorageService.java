package vn.duonghai.jobportal.service.storage;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.Resume;
import vn.duonghai.jobportal.exception.BusinessException;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CloudinaryResumeStorageService implements ResumeStorageService {

    public static final String PROVIDER = "CLOUDINARY";

    private final AppProperties appProperties;
    private final RestClient restClient;

    public CloudinaryResumeStorageService(AppProperties appProperties) {
        this.appProperties = appProperties;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public String provider() {
        return PROVIDER;
    }

    @Override
    public StoredResumeFile upload(MultipartFile file, String originalFileName) {
        AppProperties.Cloudinary cloudinary = requireCloudinaryConfig();

        String publicId = buildPublicId(cloudinary.folder());
        long timestamp = Instant.now().getEpochSecond();

        MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
        form.add("file", file.getResource());
        form.add("api_key", cloudinary.apiKey());
        form.add("timestamp", String.valueOf(timestamp));
        form.add("public_id", publicId);
        form.add("resource_type", "raw");
        form.add("filename_override", originalFileName);
        form.add("signature", sign(Map.of(
                "public_id", publicId,
                "timestamp", String.valueOf(timestamp)
        ), cloudinary.apiSecret()));

        try {
            CloudinaryUploadResponse response = restClient.post()
                    .uri(buildUploadUrl(cloudinary.cloudName()))
                    .body(form)
                    .retrieve()
                    .body(CloudinaryUploadResponse.class);

            if (response == null || response.secureUrl() == null || response.publicId() == null) {
                throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Cloud storage tra ve du lieu khong hop le");
            }

            return new StoredResumeFile(response.publicId(), response.secureUrl(), PROVIDER);
        } catch (RestClientException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the upload CV len Cloudinary");
        }
    }

    @Override
    public Resource loadAsResource(Resume resume) {
        String externalUrl = resume.getExternalFileUrl();
        if (externalUrl == null || externalUrl.isBlank()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "CV nay khong co duong dan cloud hop le");
        }
        try {
            Resource resource = new UrlResource(externalUrl);
            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay file CV tren cloud");
            }
            return resource;
        } catch (MalformedURLException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the doc file CV tu cloud");
        }
    }

    @Override
    public void delete(Resume resume) {
        String publicId = resume.getStoredFileName();
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        AppProperties.Cloudinary cloudinary = requireCloudinaryConfig();
        long timestamp = Instant.now().getEpochSecond();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("api_key", cloudinary.apiKey());
        form.add("timestamp", String.valueOf(timestamp));
        form.add("public_id", publicId);
        form.add("resource_type", "raw");
        form.add("signature", sign(Map.of(
                "public_id", publicId,
                "timestamp", String.valueOf(timestamp)
        ), cloudinary.apiSecret()));

        try {
            restClient.post()
                    .uri(buildDestroyUrl(cloudinary.cloudName()))
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the xoa file CV tren Cloudinary");
        }
    }

    private AppProperties.Cloudinary requireCloudinaryConfig() {
        AppProperties.Cloudinary cloudinary = appProperties.upload().cloudinary();
        if (cloudinary == null
                || isBlank(cloudinary.cloudName())
                || isBlank(cloudinary.apiKey())
                || isBlank(cloudinary.apiSecret())) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Chua cau hinh Cloudinary cho upload CV");
        }
        return cloudinary;
    }

    private String buildUploadUrl(String cloudName) {
        return "https://api.cloudinary.com/v1_1/" + cloudName + "/raw/upload";
    }

    private String buildDestroyUrl(String cloudName) {
        return "https://api.cloudinary.com/v1_1/" + cloudName + "/raw/destroy";
    }

    private String buildPublicId(String folder) {
        String normalizedFolder = isBlank(folder) ? "jobportal/resumes" : folder.trim();
        return normalizedFolder + "/" + UUID.randomUUID() + ".pdf";
    }

    private String sign(Map<String, String> params, String apiSecret) {
        Map<String, String> sorted = new LinkedHashMap<>(params.entrySet().stream()
                .filter(entry -> !isBlank(entry.getValue()))
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> left,
                        LinkedHashMap::new
                )));

        String payload = sorted.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&")) + apiSecret;

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).toLowerCase(Locale.ROOT);
        } catch (NoSuchAlgorithmException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the ky yeu cau upload CV");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private record CloudinaryUploadResponse(
            @JsonProperty("public_id") String publicId,
            @JsonProperty("secure_url") String secureUrl
    ) {
    }
}
