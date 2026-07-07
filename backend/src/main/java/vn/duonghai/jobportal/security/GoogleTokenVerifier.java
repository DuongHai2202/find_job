package vn.duonghai.jobportal.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.exception.BusinessException;

@Component
@RequiredArgsConstructor
public class GoogleTokenVerifier {

    private static final String GOOGLE_JWK_SET_URI = "https://www.googleapis.com/oauth2/v3/certs";

    private final AppProperties appProperties;

    public GoogleUserInfo verify(String idToken) {
        String clientId = appProperties.google().clientId();
        if (clientId == null || clientId.isBlank()) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Google Sign-In chua duoc cau hinh GOOGLE_CLIENT_ID");
        }

        try {
            Jwt jwt = buildDecoder(clientId).decode(idToken);
            String subject = jwt.getSubject();
            String email = jwt.getClaimAsString("email");
            String fullName = jwt.getClaimAsString("name");
            Boolean emailVerified = jwt.getClaimAsBoolean("email_verified");

            if (subject == null || subject.isBlank() || email == null || email.isBlank()) {
                throw new BusinessException(HttpStatus.UNAUTHORIZED, "Google ID token khong chua du thong tin bat buoc");
            }
            if (!Boolean.TRUE.equals(emailVerified)) {
                throw new BusinessException(HttpStatus.UNAUTHORIZED, "Tai khoan Google chua xac minh email");
            }

            return new GoogleUserInfo(subject, email.trim().toLowerCase(), normalizeName(fullName));
        } catch (JwtException ex) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "Google ID token khong hop le");
        }
    }

    private JwtDecoder buildDecoder(String clientId) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(GOOGLE_JWK_SET_URI).build();
        OAuth2TokenValidator<Jwt> issuerValidator = jwt -> {
            String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : null;
            boolean valid = "https://accounts.google.com".equals(issuer) || "accounts.google.com".equals(issuer);
            return valid
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Invalid Google issuer", null));
        };
        OAuth2TokenValidator<Jwt> audienceValidator = jwt -> {
            Object audClaim = jwt.getClaims().get(JwtClaimNames.AUD);
            boolean valid = false;
            if (audClaim instanceof String aud) {
                valid = clientId.equals(aud);
            } else if (audClaim instanceof Iterable<?> audValues) {
                for (Object audValue : audValues) {
                    if (clientId.equals(audValue)) {
                        valid = true;
                        break;
                    }
                }
            }
            return valid
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Invalid Google audience", null));
        };
        decoder.setJwtValidator(jwt -> {
            OAuth2TokenValidatorResult baseResult = JwtValidators.createDefault().validate(jwt);
            if (baseResult.hasErrors()) {
                return baseResult;
            }

            OAuth2TokenValidatorResult issuerResult = issuerValidator.validate(jwt);
            if (issuerResult.hasErrors()) {
                return issuerResult;
            }
            return audienceValidator.validate(jwt);
        });
        return decoder;
    }

    private String normalizeName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return "Tai khoan Google";
        }
        return fullName.trim();
    }

    public record GoogleUserInfo(
            String subject,
            String email,
            String fullName
    ) {
    }
}
