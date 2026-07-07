package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.response.PageResponse;
import vn.duonghai.jobportal.dto.response.SavedJobResponse;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.SavedJob;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.SavedJobRepository;
import vn.duonghai.jobportal.service.PageableSupport;
import vn.duonghai.jobportal.service.SavedJobService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final CandidateRepository candidateRepository;
    private final JobPostRepository jobPostRepository;

    @Override
    @Transactional
    public SavedJobResponse saveJob(Long candidateUserId, Long jobId) {
        Candidate candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay tin tuyen dung"));
        if (jobPost.getStatus() != JobStatus.APPROVED) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Chi co the luu tin da duyet");
        }
        if (savedJobRepository.existsByCandidateAndJobPost(candidate, jobPost)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Tin tuyen dung da duoc luu truoc do");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setCandidate(candidate);
        savedJob.setJobPost(jobPost);
        return SavedJobResponse.from(savedJobRepository.save(savedJob));
    }

    @Override
    @Transactional
    public void removeSavedJob(Long candidateUserId, Long jobId) {
        Candidate candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay tin tuyen dung"));
        savedJobRepository.deleteByCandidateAndJobPost(candidate, jobPost);
    }

    @Override
    public PageResponse<SavedJobResponse> getSavedJobs(Long candidateUserId, int page, int size) {
        Candidate candidate = candidateRepository.findById(candidateUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay ho so ung vien"));
        var pageable = PageableSupport.pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var resultPage = savedJobRepository.findByCandidate(candidate, pageable)
                .map(SavedJobResponse::from);
        return PageResponse.from(resultPage);
    }
}
