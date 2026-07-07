import { titleizeEnum } from "@/utils/format";

const meaninglessTokens = new Set([
  "unknown",
  "unknown company",
  "n/a",
  "na",
  "null",
  "undefined",
  "-",
  "--",
  "n\\a",
]);

export function isMeaningfulValue(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return false;
  }

  return !meaninglessTokens.has(normalized.toLowerCase());
}

export function pickFirstMeaningful(...values) {
  return values.find((value) => isMeaningfulValue(value)) || "";
}

export const homeJourneySteps = [
  {
    title: "Tìm nhanh cơ hội hợp với mình ngay từ lượt xem đầu tiên",
    description:
      "Gom việc làm theo vị trí, địa điểm và ngành nghề để bạn bớt mất thời gian lướt lan man, sớm chạm tới những cơ hội thật sự đáng cân nhắc.",
  },
  {
    title: "Xem đủ thông tin trước khi quyết định ứng tuyển",
    description:
      "Mỗi tin tuyển dụng được kể rõ hơn về công việc, quyền lợi và doanh nghiệp, để bạn nộp hồ sơ trong cảm giác yên tâm chứ không phải thử vận may.",
  },
  {
    title: "Giữ nhịp tìm việc nhẹ đầu và chủ động hơn",
    description:
      "Lưu lại những vị trí khiến bạn thấy có tương lai, quay lại đúng lúc và theo dõi hành trình tìm việc một cách gọn gàng hơn mỗi ngày.",
  },
];

export const employerValuePoints = [
  {
    title: "Tin tuyển dụng rõ ràng tạo thiện cảm cho ứng viên",
    description:
      "Một bài đăng ngắn gọn nhưng đầy đủ thông tin sẽ giúp đúng ứng viên muốn ở lại đọc tiếp và nghiêm túc cân nhắc cơ hội của doanh nghiệp.",
  },
  {
    title: "Đơn giản hóa các thao tác, phù hợp cho tuyển dụng",
    description:
      "Từ hồ sơ công ty đến danh sách ứng viên đều đi theo một nhịp rõ ràng, giúp đội tuyển dụng tiết kiệm công sức mỗi ngày.",
  },
  {
    title: "Gây dựng niềm tiên",
    description:
      "Khi doanh nghiệp xuất hiện chỉn chu và tử tế, ứng viên phù hợp sẽ chủ động mở lòng với cơ hội phỏng vấn hơn.",
  },
];

export const popularSearchKeywords = [
  "Việc làm IT",
  "Marketing",
  "Việc làm 24h",
  "Thực tập sinh",
];

export function getCompanyTrustLabel(company) {
  return company?.approved
    ? "Doanh nghiệp đã xác minh"
    : "Hồ sơ doanh nghiệp đang được hoàn thiện";
}

export function getCompanyPresence(company) {
  const address = pickFirstMeaningful(company?.address);
  const website = pickFirstMeaningful(company?.website);

  if (address && website) {
    return `${address} • ${website}`;
  }

  if (address) {
    return `${address} • Đang mở thêm cơ hội mới`;
  }

  if (website) {
    return `Bạn có thể tìm hiểu thêm tại ${website}`;
  }

  return "Doanh nghiệp đang bổ sung thêm thông tin để ứng viên cảm nhận rõ hơn về môi trường làm việc và cách đồng hành cùng nhân sự mới.";
}

export function getCompanyTagline(company, openJobs = 0) {
  const description = pickFirstMeaningful(company?.companyDescription);
  if (description) {
    return description;
  }

  if (openJobs > 1) {
    return "Doanh nghiệp đang mở nhiều vị trí cùng lúc, phù hợp với ứng viên muốn theo dõi một nơi có nhu cầu thật và nhịp tuyển dụng rõ ràng.";
  }

  return "Doanh nghiệp đang từng bước hoàn thiện hồ sơ để người tìm việc hiểu họ là ai, đang cần gì và vì sao cơ hội này đáng để cân nhắc.";
}

export function getJobLocationLabel(job) {
  return (
    pickFirstMeaningful(job?.location) || "Linh hoạt theo nhu cầu công việc"
  );
}

export function getJobCategoryLabel(job) {
  return pickFirstMeaningful(job?.category?.name) || titleizeEnum(job?.jobType);
}

export function getJobReasonToCare(job) {
  if (isMeaningfulValue(job?.benefits)) {
    return "Vị trí này đã chia sẻ khá rõ quyền lợi, nên bạn có thể sớm hình dung xem đây có phải nơi mình muốn gắn bó hay không.";
  }

  if (isMeaningfulValue(job?.salaryMin) || isMeaningfulValue(job?.salaryMax)) {
    return "Mức đãi ngộ được đưa ra sớm sẽ giúp bạn tiết kiệm thời gian và tập trung vào những cơ hội thật sự phù hợp.";
  }

  if (isMeaningfulValue(job?.location)) {
    return `Nếu bạn đang ưu tiên cơ hội tại ${job.location}, đây là vị trí đáng để mở ra xem kỹ hơn.`;
  }

  return "Tin tuyển dụng này phù hợp với người muốn bắt đầu từ một cơ hội có cách trình bày rõ ràng và dễ đưa ra quyết định hơn.";
}

export function getJobDeadlineLine(job) {
  return isMeaningfulValue(job?.deadline)
    ? `Hạn nộp đến ${job.deadline}`
    : "Nhà tuyển dụng vẫn đang chờ gặp những hồ sơ phù hợp";
}

export function getNaturalFallback(kind) {
  const fallbackMap = {
    companyDescription:
      "Doanh nghiệp đang bổ sung thêm thông tin để ứng viên hiểu rõ hơn về văn hóa làm việc, định hướng phát triển và cách cộng tác trong đội ngũ.",
    companyWebsite:
      "Website sẽ được cập nhật khi hồ sơ doanh nghiệp hoàn thiện hơn.",
    companyAddress:
      "Địa điểm làm việc cụ thể sẽ được chia sẻ rõ hơn trong quá trình trao đổi với ứng viên phù hợp.",
    jobBenefits:
      "Quyền lợi sẽ được trao đổi kỹ hơn khi nhà tuyển dụng thấy hồ sơ phù hợp với định hướng của vị trí.",
    jobRequirements:
      "Nhà tuyển dụng đang ưu tiên chia sẻ trước những tiêu chí cốt lõi; phần yêu cầu chi tiết sẽ được cập nhật thêm sớm.",
    jobDescription:
      "Mô tả vị trí đang được hoàn thiện thêm để ứng viên dễ hình dung hơn về công việc hằng ngày và kỳ vọng của đội ngũ.",
    noResume:
      "Tạo một CV ngắn gọn nhưng rõ thế mạnh là cách nhanh nhất để bạn nhận được gợi ý sát hơn và tự tin hơn khi ứng tuyển.",
    noApplications:
      "Khi bạn bắt đầu ứng tuyển, mọi cập nhật quan trọng sẽ được gom về đây để bạn theo dõi nhẹ nhàng hơn và không bỏ lỡ phản hồi cần thiết.",
    noNotifications:
      "Thông báo về cơ hội mới, trạng thái hồ sơ và phản hồi từ doanh nghiệp sẽ xuất hiện tại đây khi hành trình tìm việc của bạn bắt đầu sôi động hơn.",
    noSavedJobs:
      "Lưu lại những vị trí khiến bạn thấy hứng thú để lần sau quay lại so sánh, cân nhắc và quyết định nhanh hơn.",
    noApplicants:
      "Khi tin tuyển dụng bắt đầu thu hút đúng người, những hồ sơ mới sẽ xuất hiện tại đây để đội tuyển dụng chủ động nắm nhịp.",
  };

  return (
    fallbackMap[kind] ||
    "Thông tin này đang được hoàn thiện thêm để trải nghiệm tìm việc và tuyển dụng trọn vẹn hơn."
  );
}

export function getInitials(value) {
  if (!isMeaningfulValue(value)) {
    return "FJ";
  }

  return String(value)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
