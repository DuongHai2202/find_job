package vn.duonghai.jobportal.service.storage;

import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.exception.BusinessException;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Component
public class ResumeStorageRegistry {

    private final Map<String, ResumeStorageService> providers;

    public ResumeStorageRegistry(List<ResumeStorageService> storageServices) {
        this.providers = storageServices.stream()
                .collect(Collectors.toMap(
                        service -> normalize(service.provider()),
                        Function.identity()
                ));
    }

    public ResumeStorageService getByProvider(String provider) {
        ResumeStorageService storageService = providers.get(normalize(provider));
        if (storageService == null) {
            throw new BusinessException(INTERNAL_SERVER_ERROR, "Khong tim thay cau hinh luu tru CV phu hop");
        }
        return storageService;
    }

    private String normalize(String provider) {
        return provider == null ? "" : provider.trim().toUpperCase(Locale.ROOT);
    }
}
