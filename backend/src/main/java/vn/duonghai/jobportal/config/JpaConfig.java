package vn.duonghai.jobportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/** Bat JPA Auditing de tu dong dien created_at / updated_at (BaseEntity). */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
