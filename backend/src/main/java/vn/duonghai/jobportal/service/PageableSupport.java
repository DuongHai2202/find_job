package vn.duonghai.jobportal.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

public final class PageableSupport {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 100;

    private PageableSupport() {
    }

    public static PageRequest pageRequest(int page, int size, Sort sort) {
        return PageRequest.of(
                Math.max(page, DEFAULT_PAGE),
                normalizeSize(size),
                sort
        );
    }

    private static int normalizeSize(int size) {
        if (size <= 0) {
            return DEFAULT_SIZE;
        }
        return Math.min(size, MAX_SIZE);
    }
}
