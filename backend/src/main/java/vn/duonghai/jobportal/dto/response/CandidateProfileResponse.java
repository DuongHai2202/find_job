package vn.duonghai.jobportal.dto.response;

import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.enums.UserStatus;

import java.time.LocalDate;

public record CandidateProfileResponse(
        Long userId,
        String email,
        String fullName,
        String phone,
        UserStatus status,
        LocalDate dateOfBirth,
        String gender,
        String address,
        String headline,
        String summary
) {

    public static CandidateProfileResponse from(Candidate candidate) {
        return new CandidateProfileResponse(
                candidate.getUserId(),
                candidate.getUser().getEmail(),
                candidate.getUser().getFullName(),
                candidate.getUser().getPhone(),
                candidate.getUser().getStatus(),
                candidate.getDateOfBirth(),
                candidate.getGender(),
                candidate.getAddress(),
                candidate.getHeadline(),
                candidate.getSummary()
        );
    }
}
