package vn.duonghai.jobportal.importer;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ImportNormalizationServiceTest {

    private final ImportNormalizationService normalizationService = new ImportNormalizationService();

    @Test
    void normalizeText_shouldRecoverUtf8Mojibake() {
        var raw = "CÃƒÂ´ng ty CÃ¡Â»â€¢ phÃ¡ÂºÂ§n Y DÃ†Â°Ã¡Â»Â£c Vietlife";
        var normalized = normalizationService.normalizeText(raw);

        assertNotEquals(raw, normalized);
        assertFalse(normalized.contains("Ã"));
        assertFalse(normalized.contains("Â"));
    }

    @Test
    void normalizeNameKey_shouldConvertVietnameseToStableSlug() {
        var key = normalizationService.normalizeNameKey("CÃ´ng ty Cá»• pháº§n Y DÆ°á»£c Vietlife");

        assertEquals("cong-ty-c-phan-y-duoc-vietlife", key);
    }

    @Test
    void normalizeText_shouldReturnNullForBlank() {
        assertNull(normalizationService.normalizeText("   "));
    }
}
