package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.request.EmployerProfileRequest;
import vn.duonghai.jobportal.dto.response.EmployerProfileResponse;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.service.EmployerService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployerServiceImpl implements EmployerService {

    private final EmployerRepository employerRepository;

    @Override
    public EmployerProfileResponse getMyProfile(Long employerUserId) {
        return EmployerProfileResponse.from(getEmployerOrThrow(employerUserId));
    }

    @Override
    @Transactional
    public EmployerProfileResponse updateMyProfile(Long employerUserId, EmployerProfileRequest request) {
        var employer = getEmployerOrThrow(employerUserId);
        employer.getUser().setFullName(normalizeNullable(request.fullName()));
        employer.getUser().setPhone(normalizeNullable(request.phone()));
        employer.setCompanyName(request.companyName().trim());
        employer.setCompanyDescription(normalizeNullable(request.companyDescription()));
        employer.setTaxCode(normalizeNullable(request.taxCode()));
        employer.setLogoUrl(normalizeNullable(request.logoUrl()));
        employer.setWebsite(normalizeNullable(request.website()));
        employer.setCompanySize(normalizeNullable(request.companySize()));
        employer.setAddress(normalizeNullable(request.address()));
        return EmployerProfileResponse.from(employerRepository.save(employer));
    }

    @Override
    public EmployerProfileResponse getCompanyProfile(Long employerUserId) {
        return EmployerProfileResponse.from(getEmployerOrThrow(employerUserId));
    }

    private vn.duonghai.jobportal.entity.Employer getEmployerOrThrow(Long employerUserId) {
        return employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so nha tuyen dung"));
    }

    private String normalizeNullable(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
