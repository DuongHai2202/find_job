package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.response.CompanyFollowResponse;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.CompanyFollow;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.CompanyFollowRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.service.CompanyFollowService;
import vn.duonghai.jobportal.service.PageableSupport;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyFollowServiceImpl implements CompanyFollowService {

    private final CompanyFollowRepository companyFollowRepository;
    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;

    @Override
    @Transactional
    public CompanyFollowResponse followCompany(Long candidateUserId, Long employerUserId) {
        Candidate candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
        Employer employer = employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay doanh nghiep"));

        if (!employer.isApproved()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Chi co the theo doi doanh nghiep da duoc phe duyet");
        }
        if (companyFollowRepository.existsByCandidateAndEmployer(candidate, employer)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Ban da theo doi cong ty nay roi");
        }

        CompanyFollow follow = new CompanyFollow();
        follow.setCandidate(candidate);
        follow.setEmployer(employer);
        return CompanyFollowResponse.from(companyFollowRepository.save(follow));
    }

    @Override
    @Transactional
    public void unfollowCompany(Long candidateUserId, Long employerUserId) {
        Candidate candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
        Employer employer = employerRepository.findById(employerUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay doanh nghiep"));
        if (companyFollowRepository.deleteByCandidateAndEmployer(candidate, employer) == 0) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Ban chua theo doi cong ty nay");
        }
    }

    @Override
    public PageResponse<CompanyFollowResponse> getMyFollows(Long candidateUserId, int page, int size) {
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = companyFollowRepository.findByCandidate_UserId(candidateUserId, pageable)
                .map(CompanyFollowResponse::from);
        return PageResponse.from(resultPage);
    }
}
