package vn.duonghai.jobportal.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class GoogleOAuth2ClientConfigTest {

    private final GoogleOAuth2ClientConfig config = new GoogleOAuth2ClientConfig();

    @Test
    void isGoogleOAuthEnabled_shouldReturnFalseWhenClientCredentialsMissing() {
        var appProperties = appProperties("", "");

        assertFalse(GoogleOAuth2ClientConfig.isGoogleOAuthEnabled(appProperties));
    }

    @Test
    void isGoogleOAuthEnabled_shouldReturnTrueWhenClientCredentialsPresent() {
        var appProperties = appProperties("client-id", "client-secret");

        assertTrue(GoogleOAuth2ClientConfig.isGoogleOAuthEnabled(appProperties));
    }

    @Test
    void clientRegistrationRepository_shouldCreateRepositoryEvenWhenGoogleDisabled() {
        ClientRegistrationRepository repository = config.clientRegistrationRepository(appProperties("", ""));

        assertNotNull(repository);
        assertNull(repository.findByRegistrationId("google"));
    }

    @Test
    void clientRegistrationRepository_shouldRegisterGoogleClientWhenConfigured() {
        ClientRegistrationRepository repository = config.clientRegistrationRepository(
                appProperties("client-id", "client-secret")
        );

        assertNotNull(repository.findByRegistrationId("google"));
    }

    private AppProperties appProperties(String clientId, String clientSecret) {
        return new AppProperties(
                new AppProperties.Jwt("secret-secret-secret-secret-secret-secret", "issuer", "audience", 1000L),
                new AppProperties.Cors(List.of("http://localhost:5173")),
                new AppProperties.Upload(
                        "uploads",
                        "LOCAL",
                        new AppProperties.Cloudinary(null, null, null, null)
                ),
                new AppProperties.Google(
                        clientId,
                        clientSecret,
                        "http://localhost:5173/auth/callback",
                        "http://localhost:5173/login"
                ),
                new AppProperties.AdminBootstrap(false, null, null, null),
                false
        );
    }
}
