package vn.duonghai.jobportal.importer.model;

import java.util.ArrayList;
import java.util.List;

public class CrawlImportReport {

    private final boolean dryRun;
    private int categoriesCreated;
    private int categoriesReused;
    private int employersCreated;
    private int employersUpdated;
    private int employersSkipped;
    private int jobsCreated;
    private int jobsUpdated;
    private int jobsSkipped;
    private int tagsCreated;
    private int tagsReused;
    private final List<String> warnings = new ArrayList<>();
    private final List<String> errors = new ArrayList<>();

    public CrawlImportReport(boolean dryRun) {
        this.dryRun = dryRun;
    }

    public boolean dryRun() {
        return dryRun;
    }

    public int categoriesCreated() {
        return categoriesCreated;
    }

    public void incrementCategoriesCreated() {
        this.categoriesCreated++;
    }

    public int categoriesReused() {
        return categoriesReused;
    }

    public void incrementCategoriesReused() {
        this.categoriesReused++;
    }

    public int employersCreated() {
        return employersCreated;
    }

    public void incrementEmployersCreated() {
        this.employersCreated++;
    }

    public int employersUpdated() {
        return employersUpdated;
    }

    public void incrementEmployersUpdated() {
        this.employersUpdated++;
    }

    public int employersSkipped() {
        return employersSkipped;
    }

    public void incrementEmployersSkipped() {
        this.employersSkipped++;
    }

    public int jobsCreated() {
        return jobsCreated;
    }

    public void incrementJobsCreated() {
        this.jobsCreated++;
    }

    public int jobsUpdated() {
        return jobsUpdated;
    }

    public void incrementJobsUpdated() {
        this.jobsUpdated++;
    }

    public int jobsSkipped() {
        return jobsSkipped;
    }

    public void incrementJobsSkipped() {
        this.jobsSkipped++;
    }

    public int tagsCreated() {
        return tagsCreated;
    }

    public void incrementTagsCreated() {
        this.tagsCreated++;
    }

    public int tagsReused() {
        return tagsReused;
    }

    public void incrementTagsReused() {
        this.tagsReused++;
    }

    public List<String> warnings() {
        return warnings;
    }

    public void addWarning(String warning) {
        this.warnings.add(warning);
    }

    public List<String> errors() {
        return errors;
    }

    public void addError(String error) {
        this.errors.add(error);
    }

    public String summary() {
        return """
                dryRun=%s
                categories: created=%d reused=%d
                employers: created=%d updated=%d skipped=%d
                jobs: created=%d updated=%d skipped=%d
                tags: created=%d reused=%d
                warnings=%d errors=%d
                """.formatted(
                dryRun,
                categoriesCreated,
                categoriesReused,
                employersCreated,
                employersUpdated,
                employersSkipped,
                jobsCreated,
                jobsUpdated,
                jobsSkipped,
                tagsCreated,
                tagsReused,
                warnings.size(),
                errors.size()
        );
    }
}
