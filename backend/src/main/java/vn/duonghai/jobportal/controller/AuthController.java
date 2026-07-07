package vn.duonghai.jobportal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.dto.request.GoogleLoginRequest;
import vn.duonghai.jobportal.dto.request.LoginRequest;
import vn.duonghai.jobportal.dto.request.RegisterRequest;
import vn.duonghai.jobportal.dto.response.AuthResponse;
import vn.duonghai.jobportal.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AppProperties appProperties;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public AuthResponse loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request);
    }

    @GetMapping("/google/config")
    public GoogleAuthConfigResponse googleConfig() {
        return new GoogleAuthConfigResponse(appProperties.google().clientId());
    }

    public record GoogleAuthConfigResponse(String clientId) {
    }
}
