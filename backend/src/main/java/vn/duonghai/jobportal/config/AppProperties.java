package vn.duonghai.jobportal.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @Valid Jwt jwt,
        @Valid Cors cors,
        @Valid Upload upload,
        @Valid Google google,
        @Valid AdminBootstrap adminBootstrap,
        boolean seed
) {

    public record Jwt(
            @NotBlank String secret,
            @NotBlank String issuer,
            @NotBlank String audience,
            @Positive long expirationMs
    ) {
    }

    public record Cors(@NotEmpty List<@NotBlank String> allowedOrigins) {
    }

    public record Upload(
            @NotBlank String dir,
            @NotBlank String provider,
            @Valid Cloudinary cloudinary
    ) {
    }

    public record Cloudinary(
            String cloudName,
            String apiKey,
            String apiSecret,
            String folder
    ) {
    }

    public record Google(
            String clientId,
            String clientSecret,
            String frontendSuccessUrl,
            String frontendFailureUrl
    ) {
    }

    public record AdminBootstrap(
            boolean enabled,
            String email,
            String password,
            String fullName
    ) {
    }
}
