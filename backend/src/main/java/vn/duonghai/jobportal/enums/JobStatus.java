package vn.duonghai.jobportal.enums;

/**
 * Vong doi tin tuyen dung.
 * DRAFT -> PENDING (cho Admin duyet) -> APPROVED (hien cong khai)
 * HIDDEN (NTD an) / EXPIRED (qua han).
 */
public enum JobStatus {
    DRAFT,
    PENDING,
    APPROVED,
    HIDDEN,
    EXPIRED
}
