package vn.duonghai.jobportal.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.config.AppProperties;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    private final AppProperties.Jwt jwtProperties;
    private final SecretKey secretKey;

    public JwtTokenProvider(AppProperties appProperties) {
        this.jwtProperties = appProperties.jwt();
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(AuthenticatedUser user) {
        var now = Instant.now();
        var expiresAt = now.plusMillis(jwtProperties.expirationMs());
        var roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .subject(user.getUsername())
                .issuer(jwtProperties.issuer())
                .audience().add(jwtProperties.audience()).and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim("uid", user.id())
                .claim("roles", roles)
                .signWith(secretKey)
                .compact();
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public long expirationMs() {
        return jwtProperties.expirationMs();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(jwtProperties.issuer())
                .requireAudience(jwtProperties.audience())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
