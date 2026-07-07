package vn.duonghai.jobportal.importer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.duonghai.jobportal.importer.model.CrawlCategoryRecord;
import vn.duonghai.jobportal.importer.model.CrawlDataset;
import vn.duonghai.jobportal.importer.model.CrawlEmployerRecord;
import vn.duonghai.jobportal.importer.model.CrawlJobPostRecord;
import vn.duonghai.jobportal.repository.CategoryRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.TagRepository;
import vn.duonghai.jobportal.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CrawlImportServiceTest {

    private static final ImportNormalizationService NORMALIZATION_SERVICE = new ImportNormalizationService();

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private JobPostRepository jobPostRepository;
    @Mock
    private TagRepository tagRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    private CrawlImportService crawlImportService;

    @BeforeEach
    void setUp() {
        crawlImportService = new CrawlImportService(
                new ImportNormalizationService(),
                categoryRepository,
                employerRepository,
                jobPostRepository,
                tagRepository,
                userRepository,
                passwordEncoder
        );
    }

    @Test
    void importDataset_shouldSupportDryRunWithoutPersistingData() {
        String rawCategory = "IT phÃ¡ÂºÂ§n mÃ¡Â»Âm";
        String rawCompanyName = "CÃƒÂ´ng ty CÃ¡Â»â€¢ phÃ¡ÂºÂ§n Y DÃ†Â°Ã¡Â»Â£c Vietlife";
        String rawAddress = "97-99 LÃƒÂ¡ng HÃ¡ÂºÂ¡, HÃƒÂ  NÃ¡Â»â„¢i";

        var dataset = new CrawlDataset(
                List.of(new CrawlCategoryRecord(rawCategory)),
                List.of(new CrawlEmployerRecord(
                        rawCompanyName,
                        "ThÃƒÂ´ng tin tuyÃ¡Â»Æ’n dÃ¡Â»Â¥ng",
                        null,
                        null,
                        "50-100",
                        rawAddress,
                        "https://vn.joboko.com/cong-ty-co-phan-y-duoc-vietlife-xci427276"
                )),
                List.of(new CrawlJobPostRecord(
                        "Data Engineer | HÃƒÂ  NÃ¡Â»â„¢i",
                        "MÃƒÂ´ tÃ¡ÂºÂ£ cÃƒÂ´ng viÃ¡Â»â€¡c",
                        "SQL, Python",
                        "LÃ†Â°Ã†Â¡ng thÃƒÂ¡ng 13",
                        BigDecimal.valueOf(10_000_000),
                        BigDecimal.valueOf(20_000_000),
                        "HÃƒÂ  NÃ¡Â»â„¢i",
                        "FULLTIME",
                        "JUNIOR",
                        LocalDate.of(2026, 7, 17),
                        List.of("python", "sql"),
                        rawCompanyName,
                        rawCategory,
                        "https://vn.joboko.com/viec-lam-data-engineer-xvi6519789"
                ))
        );

        when(categoryRepository.findByNameIgnoreCase(NORMALIZATION_SERVICE.normalizeText(rawCategory)))
                .thenReturn(Optional.empty());
        when(employerRepository.findBySourceUrl("https://vn.joboko.com/cong-ty-co-phan-y-duoc-vietlife-xci427276"))
                .thenReturn(Optional.empty());
        when(employerRepository.findByCompanyNameIgnoreCaseAndAddressIgnoreCase(
                NORMALIZATION_SERVICE.normalizeText(rawCompanyName),
                NORMALIZATION_SERVICE.normalizeText(rawAddress)
        )).thenReturn(Optional.empty());
        when(jobPostRepository.findBySourceUrl("https://vn.joboko.com/viec-lam-data-engineer-xvi6519789"))
                .thenReturn(Optional.empty());
        when(tagRepository.findByNormalizedName("python")).thenReturn(Optional.empty());
        when(tagRepository.findByNormalizedName("sql")).thenReturn(Optional.empty());
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        var report = crawlImportService.importDataset(dataset, false);

        assertTrue(report.dryRun());
        assertEquals(1, report.categoriesCreated());
        assertEquals(1, report.employersCreated());
        assertEquals(1, report.jobsCreated());
        assertEquals(2, report.tagsCreated());

        verify(categoryRepository, never()).save(any());
        verify(employerRepository, never()).save(any());
        verify(jobPostRepository, never()).save(any());
        verify(tagRepository, never()).save(any());
        verify(userRepository, never()).save(any());
    }
}
