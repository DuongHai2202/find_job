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

    public record Upload(@NotBlank String dir) {
    }

    public record Google(String clientId) {
    }
}
