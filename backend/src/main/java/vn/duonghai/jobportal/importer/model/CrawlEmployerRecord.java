package vn.duonghai.jobportal.importer.model;

public record CrawlEmployerRecord(
        String companyName,
        String companyDescription,
        String logoUrl,
        String website,
        String companySize,
        String address,
        String sourceUrl
) {
}
