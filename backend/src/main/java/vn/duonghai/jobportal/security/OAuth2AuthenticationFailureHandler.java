package vn.duonghai.jobportal.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import vn.duonghai.jobportal.config.AppProperties;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final AppProperties appProperties;

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException, ServletException {
        String failureUrl = UriComponentsBuilder.fromUriString(appProperties.google().frontendFailureUrl())
                .queryParam("google_error", GoogleOAuth2ErrorCodes.GOOGLE_OAUTH_FAILED)
                .build()
                .encode()
                .toUriString();
        response.sendRedirect(failureUrl);
    }
}
