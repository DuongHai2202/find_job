package vn.duonghai.jobportal.importer;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.Locale;

@Service
public class ImportNormalizationService {

    public String normalizeText(String value) {
        String recovered = recoverUtf8Mojibake(value);
        if (recovered == null) {
            return null;
        }

        String normalizedWhitespace = recovered
                .replace('\u00A0', ' ')
                .replaceAll("[\\t\\x0B\\f\\r]+", " ")
                .replaceAll(" +", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();

        return normalizedWhitespace.isBlank() ? null : normalizedWhitespace;
    }

    public String normalizeNameKey(String value) {
        String normalized = normalizeText(value);
        if (normalized == null) {
            return null;
        }

        String withoutDiacritics = Normalizer.normalize(normalized, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd')
                .replace('Đ', 'D');

        return withoutDiacritics
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+|-+$)", "");
    }

    public String normalizeLocation(String value) {
        return normalizeText(value);
    }

    public String normalizeSourceUrl(String value) {
        String normalized = normalizeText(value);
        return normalized == null ? null : normalized.toLowerCase(Locale.ROOT);
    }

    private String recoverUtf8Mojibake(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        if (!looksLikeMojibake(trimmed)) {
            return trimmed;
        }

        String recovered = new String(trimmed.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
        return recovered.isBlank() ? trimmed : recovered;
    }

    private boolean looksLikeMojibake(String value) {
        return value.contains("Ã")
                || value.contains("Æ")
                || value.contains("Ä")
                || value.contains("áº")
                || value.contains("á»")
                || value.contains("â€");
    }
}
