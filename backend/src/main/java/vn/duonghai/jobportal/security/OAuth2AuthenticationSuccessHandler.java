package vn.duonghai.jobportal.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.dto.response.AuthResponse;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.service.GoogleOAuth2Service;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final GoogleOAuth2Service googleOAuth2Service;
    private final AppProperties appProperties;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof OAuth2User oauth2User)) {
            response.sendRedirect(appProperties.google().frontendFailureUrl()
                    + "?google_error=" + GoogleOAuth2ErrorCodes.GOOGLE_INVALID_PRINCIPAL);
            return;
        }

        String subject = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");
        Boolean emailVerified = oauth2User.getAttribute("email_verified");
        AuthResponse authResponse;
        try {
            authResponse = googleOAuth2Service.login(
                    subject,
                    email,
                    fullName,
                    Boolean.TRUE.equals(emailVerified)
            );
        } catch (BusinessException ex) {
            String failureUrl = UriComponentsBuilder.fromUriString(appProperties.google().frontendFailureUrl())
                    .queryParam("google_error", ex.getMessage())
                    .build()
                    .encode()
                    .toUriString();
            response.sendRedirect(failureUrl);
            return;
        }

        String fragment = UriComponentsBuilder.newInstance()
                .queryParam("accessToken", authResponse.accessToken())
                .queryParam("expiresIn", authResponse.expiresInMs())
                .queryParam("userId", authResponse.user().id())
                .queryParam("email", authResponse.user().email())
                .queryParam("fullName", authResponse.user().fullName())
                .queryParam("role", authResponse.user().role())
                .queryParam("status", authResponse.user().status())
                .build()
                .encode()
                .getQuery();

        response.sendRedirect(appProperties.google().frontendSuccessUrl() + "#" + fragment);
    }
}
