package vn.duonghai.jobportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;

@Configuration
public class GoogleOAuth2ClientConfig {

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository(AppProperties appProperties) {
        if (!isGoogleOAuthEnabled(appProperties)) {
            return registrationId -> null;
        }

        ClientRegistration googleRegistration = CommonOAuth2Provider.GOOGLE.getBuilder("google")
                .clientId(appProperties.google().clientId().trim())
                .clientSecret(appProperties.google().clientSecret().trim())
                .scope("openid", "profile", "email")
                .build();
        return new InMemoryClientRegistrationRepository(googleRegistration);
    }

    @Bean
    public OAuth2AuthorizedClientService authorizedClientService(
            ClientRegistrationRepository clientRegistrationRepository
    ) {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
    }

    public static boolean isGoogleOAuthEnabled(AppProperties appProperties) {
        return hasText(appProperties.google().clientId()) && hasText(appProperties.google().clientSecret());
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
