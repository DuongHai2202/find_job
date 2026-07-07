package vn.duonghai.jobportal.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.entity.Category;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.Tag;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.importer.model.CrawlDataset;
import vn.duonghai.jobportal.importer.model.CrawlImportReport;
import vn.duonghai.jobportal.importer.model.CrawlJobPostRecord;
import vn.duonghai.jobportal.repository.CategoryRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.TagRepository;
import vn.duonghai.jobportal.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CrawlImportService {

    private static final String PLACEHOLDER_PASSWORD = "crawl-import-employer";
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private final ImportNormalizationService normalizationService;
    private final CategoryRepository categoryRepository;
    private final EmployerRepository employerRepository;
    private final JobPostRepository jobPostRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CrawlImportReport importFromFile(Path filePath, boolean applyChanges) throws IOException {
        CrawlDataset dataset = objectMapper.readValue(filePath.toFile(), CrawlDataset.class);
        return importDataset(dataset, applyChanges);
    }

    @Transactional
    public CrawlImportReport importDataset(CrawlDataset dataset, boolean applyChanges) {
        CrawlImportReport report = new CrawlImportReport(!applyChanges);
        ImportContext context = new ImportContext(report, applyChanges);

        importCategories(dataset, context);
        importEmployers(dataset, context);
        importJobs(dataset, context);

        return report;
    }

    private void importCategories(CrawlDataset dataset, ImportContext context) {
        if (dataset.categories() == null) {
            return;
        }

        dataset.categories().forEach(categoryRecord -> {
            String categoryName = normalizationService.normalizeText(categoryRecord.name());
            if (categoryName == null) {
                context.report.addWarning("Bo qua category rong");
                return;
            }

            String categoryKey = normalizationService.normalizeNameKey(categoryName);
            if (context.categoriesByKey.containsKey(categoryKey)) {
                context.report.incrementCategoriesReused();
                return;
            }

            Category category = categoryRepository.findByNameIgnoreCase(categoryName)
                    .orElseGet(Category::new);

            boolean isNew = category.getId() == null;
            category.setName(categoryName);

            if (context.applyChanges && isNew) {
                category = categoryRepository.save(category);
            }

            context.categoriesByKey.put(categoryKey, category);
            if (isNew) {
                context.report.incrementCategoriesCreated();
            } else {
                context.report.incrementCategoriesReused();
            }
        });
    }

    private void importEmployers(CrawlDataset dataset, ImportContext context) {
        if (dataset.employers() == null) {
            return;
        }

        dataset.employers().forEach(record -> {
            String companyName = normalizationService.normalizeText(record.companyName());
            if (companyName == null) {
                context.report.incrementEmployersSkipped();
                context.report.addWarning("Bo qua employer do thieu companyName");
                return;
            }

            String sourceUrl = normalizationService.normalizeSourceUrl(record.sourceUrl());
            String address = normalizationService.normalizeText(record.address());
            Employer employer = resolveEmployer(companyName, sourceUrl, address);
            boolean isNew = employer == null;

            if (isNew) {
                employer = new Employer();
                employer.setUser(createPlaceholderEmployerUser(companyName, context.applyChanges));
            }

            employer.setCompanyName(companyName);
            employer.setCompanyDescription(normalizationService.normalizeText(record.companyDescription()));
            employer.setLogoUrl(normalizationService.normalizeSourceUrl(record.logoUrl()));
            employer.setWebsite(normalizationService.normalizeSourceUrl(record.website()));
            employer.setCompanySize(normalizationService.normalizeText(record.companySize()));
            employer.setAddress(address);
            employer.setSourceUrl(sourceUrl);
            employer.setApproved(true);

            if (context.applyChanges && isNew) {
                employer = employerRepository.save(employer);
            } else if (context.applyChanges) {
                employer = employerRepository.save(employer);
            }

            context.employersByCompanyKey.put(normalizationService.normalizeNameKey(companyName), employer);
            if (sourceUrl != null) {
                context.employersBySourceUrl.put(sourceUrl, employer);
            }

            if (isNew) {
                context.report.incrementEmployersCreated();
            } else {
                context.report.incrementEmployersUpdated();
            }

            if (sourceUrl == null) {
                context.report.addWarning("Employer khong co sourceUrl: " + companyName);
            }
            if ("unknown-company".equals(normalizationService.normalizeNameKey(companyName))) {
                context.report.addWarning("Employer Unknown Company can duoc review: " + companyName);
            }
        });
    }

    private void importJobs(CrawlDataset dataset, ImportContext context) {
        if (dataset.jobPosts() == null) {
            return;
        }

        dataset.jobPosts().forEach(record -> importSingleJob(record, context));
    }

    private void importSingleJob(CrawlJobPostRecord record, ImportContext context) {
        String title = normalizationService.normalizeText(record.title());
        if (title == null) {
            context.report.incrementJobsSkipped();
            context.report.addWarning("Bo qua job do thieu title");
            return;
        }

        String employerName = normalizationService.normalizeText(record.companyName());
        if (employerName == null) {
            context.report.incrementJobsSkipped();
            context.report.addWarning("Bo qua job do thieu companyName: " + title);
            return;
        }

        Employer employer = context.employersByCompanyKey.get(normalizationService.normalizeNameKey(employerName));
        if (employer == null) {
            context.report.incrementJobsSkipped();
            context.report.addError("Khong tim thay employer cho job: " + title + " / company=" + employerName);
            return;
        }

        JobPost job = resolveJob(record, employer, title);
        boolean isNew = job == null;
        if (isNew) {
            job = new JobPost();
            job.setEmployer(employer);
        }

        job.setTitle(title);
        job.setDescription(normalizationService.normalizeText(record.description()));
        job.setRequirements(normalizationService.normalizeText(record.requirements()));
        job.setBenefits(normalizationService.normalizeText(record.benefits()));
        job.setSalaryMin(record.salaryMin());
        job.setSalaryMax(record.salaryMax());
        job.setLocation(normalizationService.normalizeLocation(record.location()));
        job.setSourceUrl(normalizationService.normalizeSourceUrl(record.sourceUrl()));
        job.setJobType(resolveJobType(record.jobType(), context.report, title));
        job.setLevel(resolveJobLevel(record.level(), context.report, title));
        job.setDeadline(record.deadline());
        job.setStatus(JobStatus.APPROVED);
        job.setCategory(resolveCategory(record.categoryName(), context));
        job.setTags(resolveTags(record.tags(), context));

        if (context.applyChanges) {
            job = jobPostRepository.save(job);
        }

        if (isNew) {
            context.report.incrementJobsCreated();
        } else {
            context.report.incrementJobsUpdated();
        }
    }

    private Category resolveCategory(String categoryName, ImportContext context) {
        String normalizedName = normalizationService.normalizeText(categoryName);
        if (normalizedName == null) {
            return null;
        }

        String key = normalizationService.normalizeNameKey(normalizedName);
        Category existing = context.categoriesByKey.get(key);
        if (existing != null) {
            return existing;
        }

        Category category = categoryRepository.findByNameIgnoreCase(normalizedName)
                .orElseGet(Category::new);
        category.setName(normalizedName);

        if (context.applyChanges && category.getId() == null) {
            category = categoryRepository.save(category);
        }

        context.categoriesByKey.put(key, category);
        return category;
    }

    private Set<Tag> resolveTags(List<String> tags, ImportContext context) {
        if (tags == null || tags.isEmpty()) {
            return new LinkedHashSet<>();
        }

        Set<Tag> resolved = new LinkedHashSet<>();
        for (String rawTag : tags) {
            String tagName = normalizationService.normalizeText(rawTag);
            if (tagName == null) {
                continue;
            }

            String normalized = normalizationService.normalizeNameKey(tagName);
            if (normalized == null) {
                continue;
            }

            Tag tag = context.tagsByNormalizedName.get(normalized);
            if (tag == null) {
                tag = tagRepository.findByNormalizedName(normalized).orElseGet(Tag::new);
                boolean isNew = tag.getId() == null;
                tag.setName(tagName);
                tag.setNormalizedName(normalized);
                if (context.applyChanges && isNew) {
                    tag = tagRepository.save(tag);
                }
                context.tagsByNormalizedName.put(normalized, tag);
                if (isNew) {
                    context.report.incrementTagsCreated();
                } else {
                    context.report.incrementTagsReused();
                }
            } else {
                context.report.incrementTagsReused();
            }
            resolved.add(tag);
        }
        return resolved;
    }

    private Employer resolveEmployer(String companyName, String sourceUrl, String address) {
        if (sourceUrl != null) {
            java.util.Optional<Employer> bySource = employerRepository.findBySourceUrl(sourceUrl);
            if (bySource.isPresent()) {
                return bySource.get();
            }
        }

        if (address != null) {
            java.util.Optional<Employer> byNameAndAddress =
                    employerRepository.findByCompanyNameIgnoreCaseAndAddressIgnoreCase(companyName, address);
            if (byNameAndAddress.isPresent()) {
                return byNameAndAddress.get();
            }
        }

        return null;
    }

    private JobPost resolveJob(CrawlJobPostRecord record, Employer employer, String title) {
        String sourceUrl = normalizationService.normalizeSourceUrl(record.sourceUrl());
        if (sourceUrl != null) {
            java.util.Optional<JobPost> bySource = jobPostRepository.findBySourceUrl(sourceUrl);
            if (bySource.isPresent()) {
                return bySource.get();
            }
        }

        String location = normalizationService.normalizeLocation(record.location());
        if (location != null && record.deadline() != null && employer.getUserId() != null) {
            return jobPostRepository.findByEmployer_UserIdAndTitleIgnoreCaseAndLocationIgnoreCaseAndDeadline(
                    employer.getUserId(),
                    title,
                    location,
                    record.deadline()
            ).orElse(null);
        }

        return null;
    }

    private JobType resolveJobType(String value, CrawlImportReport report, String title) {
        String normalized = normalizationService.normalizeText(value);
        if (normalized == null) {
            report.addWarning("JobType rong, default FULLTIME cho job: " + title);
            return JobType.FULLTIME;
        }

        try {
            return JobType.valueOf(normalized.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            report.addWarning("JobType khong hop le '" + normalized + "', default FULLTIME cho job: " + title);
            return JobType.FULLTIME;
        }
    }

    private JobLevel resolveJobLevel(String value, CrawlImportReport report, String title) {
        String normalized = normalizationService.normalizeText(value);
        if (normalized == null) {
            report.addWarning("JobLevel rong, default JUNIOR cho job: " + title);
            return JobLevel.JUNIOR;
        }

        try {
            return JobLevel.valueOf(normalized.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            report.addWarning("JobLevel khong hop le '" + normalized + "', default JUNIOR cho job: " + title);
            return JobLevel.JUNIOR;
        }
    }

    private User createPlaceholderEmployerUser(String companyName, boolean applyChanges) {
        String companyKey = normalizationService.normalizeNameKey(companyName);
        String baseEmail = Objects.requireNonNullElse(companyKey, "crawl-employer") + "@crawl.jobportal.local";
        String email = uniqueEmail(baseEmail);

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(PLACEHOLDER_PASSWORD));
        user.setFullName(companyName);
        user.setPhone(null);
        user.setRole(Role.EMPLOYER);
        user.setStatus(UserStatus.ACTIVE);
        return applyChanges ? userRepository.save(user) : user;
    }

    private String uniqueEmail(String baseEmail) {
        if (!userRepository.existsByEmail(baseEmail)) {
            return baseEmail;
        }

        int atIndex = baseEmail.indexOf('@');
        String localPart = atIndex > 0 ? baseEmail.substring(0, atIndex) : baseEmail;
        String domain = atIndex > 0 ? baseEmail.substring(atIndex) : "@crawl.jobportal.local";

        for (int index = 2; index < 10_000; index++) {
            String candidate = localPart + "-" + index + domain;
            if (!userRepository.existsByEmail(candidate)) {
                return candidate;
            }
        }

        throw new IllegalStateException("Khong the sinh email placeholder duy nhat cho employer crawl");
    }

    private static final class ImportContext {
        private final CrawlImportReport report;
        private final boolean applyChanges;
        private final Map<String, Category> categoriesByKey = new LinkedHashMap<>();
        private final Map<String, Employer> employersBySourceUrl = new LinkedHashMap<>();
        private final Map<String, Employer> employersByCompanyKey = new LinkedHashMap<>();
        private final Map<String, Tag> tagsByNormalizedName = new LinkedHashMap<>();

        private ImportContext(CrawlImportReport report, boolean applyChanges) {
            this.report = report;
            this.applyChanges = applyChanges;
        }
    }
}
