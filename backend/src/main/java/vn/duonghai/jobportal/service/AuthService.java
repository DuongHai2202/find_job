package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.request.LoginRequest;
import vn.duonghai.jobportal.dto.request.RegisterRequest;
import vn.duonghai.jobportal.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
