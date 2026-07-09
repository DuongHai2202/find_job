const numberFormatter = new Intl.NumberFormat("vi-VN");
const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const enumLabelMap = {
  FULLTIME: "Toàn thời gian",
  PARTTIME: "Bán thời gian",
  REMOTE: "Làm việc từ xa",
  JUNIOR: "Mới đi làm",
  MIDDLE: "Đã có kinh nghiệm",
  SENIOR: "Chuyên viên cao cấp",
  MANAGER: "Quản lý",
  INTERN: "Thực tập sinh",
  DRAFT: "Bản nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đang hiển thị",
  HIDDEN: "Tạm ẩn",
  EXPIRED: "Hết hạn",
  ACTIVE: "Đang hoạt động",
  LOCKED: "Đã khóa",
  VIEWED: "Đã xem",
  INTERVIEW: "Mời phỏng vấn",
  ACCEPTED: "Đã nhận",
  REJECTED: "Từ chối",
  NEW_JOB: "Việc làm mới",
  APPLICATION_STATUS: "Cập nhật hồ sơ",
  SYSTEM: "Thông báo hệ thống",
  CANDIDATE: "Ứng viên",
  EMPLOYER: "Nhà tuyển dụng",
  ADMIN: "Quản trị viên",
};

export function formatCurrencyRange(min, max) {
  if (min && max) {
    return `${currencyFormatter.format(min)} - ${currencyFormatter.format(max)}`;
  }

  if (min) {
    return `Từ ${currencyFormatter.format(min)}`;
  }

  if (max) {
    return `Đến ${currencyFormatter.format(max)}`;
  }

  return "Mức lương sẽ trao đổi theo năng lực";
}

export function formatDate(value) {
  if (!value) {
    return "Chưa có thời hạn cụ thể";
  }

  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) {
    return "Chưa có cập nhật mới";
  }

  return dateTimeFormatter.format(new Date(value));
}

export function formatCompactNumber(value) {
  return numberFormatter.format(value ?? 0);
}

export function titleizeEnum(value) {
  if (!value) {
    return "Đang bổ sung";
  }

  const normalized = value.toString().trim().toUpperCase();
  if (enumLabelMap[normalized]) {
    return enumLabelMap[normalized];
  }

  return normalized
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function splitMultilineText(value) {
  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function buildResumeDownloadUrl(apiUrl, resumeId) {
  return `${apiUrl}/resumes/${resumeId}/download`;
}
