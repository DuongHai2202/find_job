package vn.duonghai.jobportal.importer.model;

import java.util.List;

public record CrawlDataset(
        List<CrawlCategoryRecord> categories,
        List<CrawlEmployerRecord> employers,
        List<CrawlJobPostRecord> jobPosts
) {
}
