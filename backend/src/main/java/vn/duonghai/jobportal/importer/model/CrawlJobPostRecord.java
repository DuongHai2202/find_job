package vn.duonghai.jobportal.importer.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CrawlJobPostRecord(
        String title,
        String description,
        String requirements,
        String benefits,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String location,
        String jobType,
        String level,
        LocalDate deadline,
        List<String> tags,
        String companyName,
        String categoryName,
        String sourceUrl
) {
}
