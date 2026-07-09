package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.response.AuthResponse;

public interface GoogleOAuth2Service {

    AuthResponse login(String subject, String email, String fullName, boolean emailVerified);
}
