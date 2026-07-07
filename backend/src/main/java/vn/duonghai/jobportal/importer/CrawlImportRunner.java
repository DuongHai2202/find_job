package vn.duonghai.jobportal.importer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import vn.duonghai.jobportal.importer.model.CrawlImportReport;

import java.nio.file.Path;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CrawlImportRunner implements ApplicationRunner {

    private static final String IMPORT_FILE_OPTION = "import-crawl-file";
    private static final String APPLY_OPTION = "import-crawl-apply";

    private final CrawlImportService crawlImportService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!args.containsOption(IMPORT_FILE_OPTION)) {
            return;
        }

        List<String> fileOption = args.getOptionValues(IMPORT_FILE_OPTION);
        if (fileOption == null || fileOption.isEmpty()) {
            log.warn("Bo qua import crawl vi thieu duong dan file");
            return;
        }

        Path filePath = Path.of(fileOption.getFirst());
        boolean applyChanges = args.containsOption(APPLY_OPTION)
                && Boolean.parseBoolean(args.getOptionValues(APPLY_OPTION).getFirst());

        CrawlImportReport report = crawlImportService.importFromFile(filePath, applyChanges);
        log.info("Crawl import finished for {}{}", filePath, System.lineSeparator() + report.summary());
        report.warnings().forEach(warning -> log.warn("crawl-import warning: {}", warning));
        report.errors().forEach(error -> log.error("crawl-import error: {}", error));
    }
}
