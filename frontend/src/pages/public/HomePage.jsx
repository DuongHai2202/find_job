import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getCategories } from "@/api/categoryApi";
import { getPublicJobs } from "@/api/jobApi";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CompanyLogo } from "@/components/companyLogo";
import { Button, EmptyState, ErrorState, SkeletonBlock } from "@/components/ui";
import {
  employerValuePoints,
  getCompanyPresence,
  getCompanyTrustLabel,
  getJobReasonToCare,
  homeJourneySteps,
  isMeaningfulValue,
  pickFirstMeaningful,
} from "@/content/siteCopy";
import {
  formatCompactNumber,
  formatCurrencyRange,
  titleizeEnum,
} from "@/utils/format";

const searchDefaults = {
  keyword: "",
  location: "",
  categoryId: "",
  jobType: "",
  level: "",
};

const shortcutKeywords = [
  { label: "Việc làm công nghệ", keyword: "Java" },
  { label: "Marketing sáng tạo", keyword: "Marketing" },
  { label: "Cơ hội từ xa", keyword: "Remote" },
  { label: "Thực tập sinh", keyword: "Intern" },
];

const fallbackLocations = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Bình Dương",
  "Cần Thơ",
  "Hải Phòng",
];

const quickNeeds = [
  { label: "Việc làm mới cập nhật", params: {} },
  { label: "Cơ hội từ xa", params: { jobType: "REMOTE" } },
  { label: "Thực tập sinh", params: { keyword: "Intern", level: "JUNIOR" } },
  { label: "Nhân sự có kinh nghiệm", params: { level: "MIDDLE" } },
  { label: "Quản lý / trưởng nhóm", params: { level: "MANAGER" } },
  { label: "Toàn thời gian", params: { jobType: "FULLTIME" } },
];

const careerGuideEntries = [
  {
    topic: "Kỹ năng & Xu hướng",
    publishedAt: "06/07/2026",
    title: "Những kỹ năng AI nào đang được nhà tuyển dụng ưu tiên?",
    description:
      "Hiểu đúng vai trò của AI trong công việc để biết nên học gì trước, ứng dụng vào đâu và biến nó thành lợi thế khi tìm việc.",
  },
  {
    topic: "CV & Hồ sơ",
    publishedAt: "05/07/2026",
    title: "Cách làm CV gọn mà vẫn đủ thuyết phục",
    description:
      "Một CV rõ trọng tâm giúp nhà tuyển dụng thấy nhanh điều bạn làm được, thay vì phải đọc quá nhiều nhưng vẫn chưa chạm đúng ý.",
  },
  {
    topic: "Ứng tuyển",
    publishedAt: "05/07/2026",
    title: "Viết thư ứng tuyển sao cho không bị nhạt",
    description:
      "Không cần dài dòng. Chỉ cần đúng giọng, đúng lý do và đúng điểm mạnh để người đọc muốn mở hồ sơ của bạn tiếp theo.",
  },
  {
    topic: "Phỏng vấn",
    publishedAt: "04/07/2026",
    title: "Chuẩn bị phỏng vấn theo từng nhóm ngành",
    description:
      "Mỗi vị trí có cách hỏi khác nhau. Chuẩn bị đúng nhóm câu hỏi giúp bạn bớt lúng túng và trả lời tự nhiên hơn.",
  },
  {
    topic: "Thu nhập & Đàm phán",
    publishedAt: "03/07/2026",
    title: "Thương lượng lương mà vẫn giữ được thiện cảm",
    description:
      "Biết lúc nào nên nói về thu nhập, nói ở mức nào và đưa căn cứ ra sao để cuộc trao đổi dễ đi đến kết quả tốt hơn.",
  },
  {
    topic: "Đọc vị doanh nghiệp",
    publishedAt: "03/07/2026",
    title: "Nhìn hồ sơ công ty để đo độ phù hợp trước khi ứng tuyển",
    description:
      "Không chỉ xem tên thương hiệu. Hãy đọc cách doanh nghiệp tuyển người, mô tả công việc và nhịp tuyển dụng để chọn đúng nơi đáng theo dõi.",
  },
  {
    topic: "Định hướng sự nghiệp",
    publishedAt: "02/07/2026",
    title: "Khi nào nên chuyển việc và khi nào nên ở lại",
    description:
      "Đừng nhảy việc chỉ vì mệt. Cũng đừng cố ở lại khi cơ hội phát triển đã chững. Biết cách tự đánh giá sẽ giúp bạn quyết định tỉnh táo hơn.",
  },
  {
    topic: "Hồ sơ online",
    publishedAt: "02/07/2026",
    title: "Portfolio, LinkedIn và hồ sơ online cần gì là đủ",
    description:
      "Không phải ai cũng cần làm thật cầu kỳ. Quan trọng là bạn chọn đúng phần cần thể hiện để hồ sơ online hỗ trợ tốt cho CV.",
  },
  {
    topic: "An toàn tìm việc",
    publishedAt: "01/07/2026",
    title: "Những dấu hiệu nên cẩn trọng khi xem tin tuyển dụng",
    description:
      "Nhận ra sớm các dấu hiệu thiếu minh bạch sẽ giúp bạn tránh mất thời gian và giữ an toàn hơn trong quá trình tìm việc.",
  },
];

const COMPANY_VISIBLE_CARDS = 5;
const COMPANY_AUTOPLAY_DELAY = 3200;
const CAREER_GUIDES_PER_PAGE = 3;
const CAREER_GUIDE_AUTOPLAY_DELAY = 5800;
const homeGuides = [];
const careerGuideItems = [
  {
    topic: "Kỹ năng và xu hướng",
    publishedAt: "06/07/2026",
    title: "Những kỹ năng AI nào đang được nhà tuyển dụng ưu tiên?",
    description:
      "Hiểu đúng vai trò của AI trong công việc để biết nên học gì trước, ứng dụng vào đâu và biến nó thành lợi thế khi tìm việc.",
  },
  {
    topic: "CV và hồ sơ",
    publishedAt: "05/07/2026",
    title: "Cách làm CV gọn mà vẫn đủ sức thuyết phục",
    description:
      "Một CV rõ trọng tâm giúp nhà tuyển dụng thấy nhanh điều bạn làm được, thay vì phải đọc quá nhiều nhưng vẫn chưa chạm đúng ý.",
  },
  {
    topic: "Ứng tuyển",
    publishedAt: "05/07/2026",
    title: "Viết thư ứng tuyển sao cho không bị nhạt",
    description:
      "Không cần dài dòng. Chỉ cần đúng giọng, đúng lý do và đúng điểm mạnh để người đọc muốn mở hồ sơ của bạn tiếp theo.",
  },
  {
    topic: "Phỏng vấn",
    publishedAt: "04/07/2026",
    title: "Chuẩn bị phỏng vấn theo từng nhóm ngành",
    description:
      "Mỗi vị trí có cách hỏi khác nhau. Chuẩn bị đúng nhóm câu hỏi giúp bạn bớt lúng túng và trả lời tự nhiên hơn.",
  },
  {
    topic: "Thu nhập và đàm phán",
    publishedAt: "03/07/2026",
    title: "Thương lượng lương mà vẫn giữ được thiện cảm",
    description:
      "Biết lúc nào nên nói về thu nhập, nói ở mức nào và đưa căn cứ ra sao để cuộc trao đổi dễ đi đến kết quả tốt hơn.",
  },
  {
    topic: "Đọc vị doanh nghiệp",
    publishedAt: "03/07/2026",
    title: "Nhìn hồ sơ công ty để đo độ phù hợp trước khi ứng tuyển",
    description:
      "Không chỉ xem tên thương hiệu. Hãy đọc cách doanh nghiệp tuyển người, mô tả công việc và nhịp tuyển dụng để chọn đúng nơi đáng theo dõi.",
  },
  {
    topic: "Định hướng sự nghiệp",
    publishedAt: "02/07/2026",
    title: "Khi nào nên chuyển việc và khi nào nên ở lại",
    description:
      "Đừng nhảy việc chỉ vì mệt. Cũng đừng cố ở lại khi cơ hội phát triển đã chững. Biết cách tự đánh giá sẽ giúp bạn quyết định tỉnh táo hơn.",
  },
  {
    topic: "Hồ sơ online",
    publishedAt: "02/07/2026",
    title: "Portfolio, LinkedIn và hồ sơ online cần gì là đủ",
    description:
      "Không phải ai cũng cần làm thật cầu kỳ. Quan trọng là bạn chọn đúng phần cần thể hiện để hồ sơ online hỗ trợ tốt cho CV.",
  },
  {
    topic: "An toàn tìm việc",
    publishedAt: "01/07/2026",
    title: "Những dấu hiệu nên cẩn trọng khi xem tin tuyển dụng",
    description:
      "Nhận ra sớm các dấu hiệu thiếu minh bạch sẽ giúp bạn tránh mất thời gian và giữ an toàn hơn trong quá trình tìm việc.",
  },
];

const careerGuideDeck = [
  {
    topic: "Kỹ năng và xu hướng",
    publishedAt: "06/07/2026",
    title: "Top kỹ năng AI đang được nhà tuyển dụng săn đón trong năm 2026",
    description:
      "Doanh nghiệp không chỉ tìm người biết dùng công cụ, mà còn cần ứng viên hiểu cách đặt câu hỏi, xử lý dữ liệu và phối hợp AI vào công việc thật. Nếu bạn muốn tăng lợi thế khi ứng tuyển, đây là nhóm kỹ năng nên bắt đầu sớm để đi trước một nhịp.",
  },
  {
    topic: "CV và hồ sơ",
    publishedAt: "05/07/2026",
    title: "Cách làm CV gọn nhưng vẫn đủ sức thuyết phục ngay từ lần đọc đầu",
    description:
      "Một CV tốt không cần quá dài, nhưng phải đủ rõ để người tuyển dụng nhận ra điểm mạnh, kinh nghiệm và mức độ phù hợp của bạn chỉ trong vài chục giây. Bài viết này gợi ý cách rút gọn nội dung mà vẫn giữ được chiều sâu cần thiết cho một hồ sơ tử tế.",
  },
  {
    topic: "Ứng tuyển",
    publishedAt: "05/07/2026",
    title:
      "Viết thư ứng tuyển sao cho không bị nhạt và vẫn giữ được dấu ấn riêng",
    description:
      "Cover letter không phải nơi để lặp lại CV, mà là chỗ giúp nhà tuyển dụng thấy vì sao bạn thật sự quan tâm đến vị trí đó và có thể đóng góp điều gì. Chỉ cần đúng giọng, đúng trọng tâm và chân thành là đã nổi bật hơn rất nhiều hồ sơ còn lại.",
  },
  {
    topic: "Phỏng vấn",
    publishedAt: "04/07/2026",
    title:
      "Bộ câu hỏi phỏng vấn Marketing thường gặp và gợi ý trả lời ấn tượng",
    description:
      "Marketing là lĩnh vực có nhiều dạng công việc khác nhau, từ content, performance đến trade hay branding. Bộ câu hỏi dưới đây sẽ giúp bạn hình dung rõ cách nhà tuyển dụng đánh giá tư duy, kinh nghiệm và khả năng xử lý tình huống trong buổi phỏng vấn thực tế.",
  },
  {
    topic: "Phỏng vấn",
    publishedAt: "03/07/2026",
    title:
      "Câu hỏi phỏng vấn Logistics phổ biến 2026 và cách trả lời dễ ghi điểm",
    description:
      "Logistics không chỉ có điều phối đơn hàng mà còn gắn với vận hành, kiểm soát tiến độ và xử lý phát sinh liên tục. Nếu bạn đang nhắm tới ngành này, danh sách câu hỏi và hướng trả lời trong bài sẽ giúp bạn tự tin hơn khi bước vào vòng trao đổi chuyên môn.",
  },
  {
    topic: "Phỏng vấn",
    publishedAt: "03/07/2026",
    title:
      "Câu hỏi phỏng vấn Nhân viên Xuất nhập khẩu hay gặp và cách gỡ điểm khó",
    description:
      "Với vị trí xuất nhập khẩu, nhà tuyển dụng thường quan tâm đến khả năng xử lý chứng từ, phối hợp đối tác và phản ứng trước tình huống phát sinh. Bài viết này tổng hợp những câu hỏi dễ gặp nhất, kèm gợi ý để bạn trả lời chắc tay và bớt mất điểm không đáng.",
  },
  {
    topic: "Tổng quan nghề nghiệp",
    publishedAt: "02/07/2026",
    title:
      "Các vị trí trong ngành Logistics phổ biến và cơ hội việc làm năm 2026",
    description:
      "Logistics hiện không chỉ xoay quanh giao nhận hay kho vận như nhiều người vẫn nghĩ. Đây là một hệ sinh thái công việc rộng, từ chứng từ, vận hành, mua hàng đến quản lý chuỗi cung ứng. Nếu bạn mới tìm hiểu ngành, bài này sẽ giúp bạn nhìn rõ đường đi hơn.",
  },
  {
    topic: "Tổng quan nghề nghiệp",
    publishedAt: "02/07/2026",
    title:
      "Marketing là gì? Tổng quan kiến thức và cơ hội việc làm cho người mới",
    description:
      "Marketing là một trong những nhóm ngành mở ra nhiều ngả rẽ nghề nghiệp nhất hiện nay. Từ người mới bắt đầu đến ứng viên đã có kinh nghiệm đều có thể tìm thấy hướng đi phù hợp nếu hiểu rõ các mảng công việc, kỹ năng cốt lõi và nhịp phát triển của ngành.",
  },
  {
    topic: "Xu hướng việc làm mới",
    publishedAt: "01/07/2026",
    title: "AI Trainer là gì? Mức lương và cơ hội việc làm đang được quan tâm",
    description:
      "AI Trainer đang trở thành một lựa chọn nghề nghiệp mới khi nhiều doanh nghiệp bắt đầu đầu tư mạnh cho trí tuệ nhân tạo. Nếu bạn tò mò công việc này thực sự làm gì, cần nền tảng nào và liệu có phù hợp với mình không, đây sẽ là phần đọc rất đáng xem.",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const companySliderRef = useRef(null);
  const [search, setSearch] = useState(searchDefaults);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCompanyIndex, setActiveCompanyIndex] = useState(0);
  const [activeCareerGuidePage, setActiveCareerGuidePage] = useState(0);
  const [companyStep, setCompanyStep] = useState(0);
  const [companyTransitionEnabled, setCompanyTransitionEnabled] =
    useState(true);
  const [state, setState] = useState({
    loading: true,
    error: "",
    jobs: [],
    totalElements: 0,
    companies: [],
  });

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await getPublicJobs({ page: 0, size: 18 });
        if (ignore) {
          return;
        }

        const companyMap = new Map();
        response.content.forEach((job) => {
          if (
            !job.employer?.id ||
            !isMeaningfulValue(job.employer?.companyName)
          ) {
            return;
          }

          const current = companyMap.get(job.employer.id);
          companyMap.set(job.employer.id, {
            userId: job.employer.id,
            companyName: job.employer.companyName,
            approved: job.employer.approved,
            logoUrl: pickFirstMeaningful(
              current?.logoUrl,
              job.employer?.logoUrl,
            ),
            companyDescription: pickFirstMeaningful(
              current?.companyDescription,
              job.employer?.companyDescription,
            ),
            website: pickFirstMeaningful(
              current?.website,
              job.employer?.website,
            ),
            address: pickFirstMeaningful(
              current?.address,
              job.employer?.address,
              job.location,
            ),
            openJobs: (current?.openJobs || 0) + 1,
          });
        });

        setState({
          loading: false,
          error: "",
          jobs: response.content,
          totalElements: response.totalElements,
          companies: Array.from(companyMap.values()),
        });
      } catch (error) {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error:
              error.response?.data?.message ||
              "Trang chủ đang cần thêm một chút thời gian để chuẩn bị những cơ hội phù hợp cho bạn.",
          }));
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  function buildJobsUrl(params) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    return `/jobs${query.toString() ? `?${query.toString()}` : ""}`;
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildJobsUrl(search));
  }

  function handleShortcutClick(keyword) {
    navigate(buildJobsUrl({ keyword }));
  }

  const featuredJobs = state.jobs.slice(0, 8);
  const featuredCompanies = useMemo(
    () =>
      state.companies
        .filter((company) => isMeaningfulValue(company.companyName))
        .sort((left, right) => (right.openJobs || 0) - (left.openJobs || 0))
        .slice(0, 15),
    [state.companies],
  );

  const companyLoopItems = useMemo(() => {
    return featuredCompanies;
  }, [featuredCompanies]);
  const companyMaxIndex = useMemo(
    () => Math.max(featuredCompanies.length - COMPANY_VISIBLE_CARDS, 0),
    [featuredCompanies.length],
  );

  const quickLocations = useMemo(() => {
    const fromJobs = state.jobs
      .map((job) => pickFirstMeaningful(job.location))
      .filter(Boolean);
    return Array.from(new Set([...fromJobs, ...fallbackLocations])).slice(0, 6);
  }, [state.jobs]);

  const spotlightCategories = useMemo(
    () => categories.slice(0, 8),
    [categories],
  );
  const categoryHighlights = useMemo(
    () =>
      categories.slice(0, 6).map((category) => ({
        ...category,
        openCount: state.jobs.filter((job) => job.category?.id === category.id)
          .length,
      })),
    [categories, state.jobs],
  );
  const careerGuidePages = useMemo(() => {
    const pages = [];
    for (
      let index = 0;
      index < careerGuideDeck.length;
      index += CAREER_GUIDES_PER_PAGE
    ) {
      pages.push(careerGuideDeck.slice(index, index + CAREER_GUIDES_PER_PAGE));
    }
    return pages;
  }, []);
  const careerGuideMaxIndex = useMemo(
    () => Math.max(careerGuidePages.length - 1, 0),
    [careerGuidePages.length],
  );

  useEffect(() => {
    setActiveCompanyIndex(0);
    setCompanyTransitionEnabled(true);
  }, [featuredCompanies.length]);

  useEffect(() => {
    setActiveCareerGuidePage(0);
  }, [careerGuidePages.length]);

  useEffect(() => {
    const slider = companySliderRef.current;
    if (!slider) {
      return undefined;
    }

    function updateCompanyStep() {
      const firstCard = slider.firstElementChild;
      if (!firstCard) {
        setCompanyStep(0);
        return;
      }

      const sliderStyles = window.getComputedStyle(slider);
      const gap = Number.parseFloat(
        sliderStyles.columnGap || sliderStyles.gap || "0",
      );
      setCompanyStep(firstCard.getBoundingClientRect().width + gap);
    }

    updateCompanyStep();
    window.addEventListener("resize", updateCompanyStep);
    return () => window.removeEventListener("resize", updateCompanyStep);
  }, [companyLoopItems.length]);

  useEffect(() => {
    if (featuredCompanies.length <= COMPANY_VISIBLE_CARDS || companyStep <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveCompanyIndex((current) =>
        current >= companyMaxIndex ? 0 : current + 1,
      );
    }, COMPANY_AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [companyMaxIndex, companyStep, featuredCompanies.length]);

  useEffect(() => {
    if (careerGuidePages.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveCareerGuidePage((current) =>
        current >= careerGuideMaxIndex ? 0 : current + 1,
      );
    }, CAREER_GUIDE_AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [careerGuideMaxIndex, careerGuidePages.length]);

  function handleCompanyPage(direction) {
    if (featuredCompanies.length <= COMPANY_VISIBLE_CARDS) {
      return;
    }

    if (direction < 0 && activeCompanyIndex === 0) {
      setActiveCompanyIndex(companyMaxIndex);
      return;
    }

    if (direction > 0 && activeCompanyIndex >= companyMaxIndex) {
      setActiveCompanyIndex(0);
      return;
    }

    setActiveCompanyIndex((current) => current + direction);
  }

  function handleCareerGuidePage(direction) {
    if (careerGuidePages.length <= 1) {
      return;
    }

    if (direction < 0 && activeCareerGuidePage === 0) {
      setActiveCareerGuidePage(careerGuideMaxIndex);
      return;
    }

    if (direction > 0 && activeCareerGuidePage >= careerGuideMaxIndex) {
      setActiveCareerGuidePage(0);
      return;
    }

    setActiveCareerGuidePage((current) => current + direction);
  }

  return (
    <>
      <section className="portal-hero portal-hero--editorial">
        <div className="portal-hero__inner">
          <div className="portal-hero__ticker">
            <span>
              Có {`${formatCompactNumber(state.totalElements)}+`} việc làm đang
              mở
            </span>
            <span>
              {`${formatCompactNumber(featuredCompanies.length)}+`} doanh nghiệp
              đang tuyển
            </span>
            <span>
              {`${formatCompactNumber(categories.length)}+`} nhóm ngành để bạn
              bắt đầu
            </span>
          </div>

          <div className="portal-hero__copy">
            <span className="portal-hero__eyebrow">
              Nơi việc làm tốt được trình bày đủ rõ để bạn muốn bấm xem tiếp
            </span>
            <h3 className="portal-hero__title">
              Tìm kiếm cơ hội nghề nghiệp phù hợp
            </h3>
            <p className="portal-hero__description">
              Từ vị trí mới đến hồ sơ doanh nghiệp, mọi thứ được sắp lại theo
              cách dễ đọc, dễ so sánh và đủ tinh tế để bạn nhận ra đâu là nơi
              đáng gửi gắm bước tiếp theo.
            </p>
          </div>

          <form className="portal-search" onSubmit={handleSearchSubmit}>
            <div className="portal-search__row">
              <input
                className="portal-search__control"
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    keyword: event.target.value,
                  }))
                }
                placeholder="Tên vị trí, kỹ năng hoặc công ty bạn đang quan tâm"
                value={search.keyword}
              />
              <input
                className="portal-search__control"
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                placeholder="Bạn muốn làm việc ở đâu?"
                value={search.location}
              />
              <select
                className="portal-search__control"
                onChange={(event) =>
                  setSearch((current) => ({
                    ...current,
                    categoryId: event.target.value,
                  }))
                }
                value={search.categoryId}
              >
                <option value="">Tất cả ngành nghề</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button className="portal-search__button" type="submit">
                Tìm việc
              </button>
            </div>

            <div className="portal-search__subrow">
              <div className="portal-shortcuts">
                <span className="portal-shortcuts__label">Được tìm nhiều:</span>
                {shortcutKeywords.map((item) => (
                  <button
                    className="portal-shortcuts__chip"
                    key={item.label}
                    onClick={() => handleShortcutClick(item.keyword)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                className="portal-advanced-toggle"
                onClick={() => setShowAdvancedFilters((current) => !current)}
                type="button"
              >
                {showAdvancedFilters ? "Ẩn lọc nâng cao" : "Lọc nâng cao"}
              </button>
            </div>

            {showAdvancedFilters ? (
              <div className="portal-advanced-filters">
                <div className="portal-advanced-filters__grid">
                  <div className="portal-advanced-filters__row">
                    <select
                      className="portal-search__control portal-search__control--advanced"
                      onChange={(event) =>
                        setSearch((current) => ({
                          ...current,
                          jobType: event.target.value,
                        }))
                      }
                      value={search.jobType}
                    >
                      <option value="">Tất cả loại hình</option>
                      <option value="FULLTIME">Toàn thời gian</option>
                      <option value="REMOTE">Từ xa</option>
                    </select>

                    <select
                      className="portal-search__control portal-search__control--advanced"
                      onChange={(event) =>
                        setSearch((current) => ({
                          ...current,
                          level: event.target.value,
                        }))
                      }
                      value={search.level}
                    >
                      <option value="">Tất cả cấp bậc</option>
                      <option value="JUNIOR">Thực tập sinh / Nhân viên</option>
                      <option value="MIDDLE">Đã có kinh nghiệm</option>
                      <option value="MANAGER">Trưởng nhóm / Quản lý</option>
                    </select>
                  </div>

                  <div className="portal-advanced-filters__chips">
                    <span>Địa điểm nổi bật:</span>
                    {quickLocations.map((location) => (
                      <button
                        className="portal-discovery-chip"
                        key={location}
                        onClick={() =>
                          setSearch((current) => ({ ...current, location }))
                        }
                        type="button"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title portal-section__title--star">
              Doanh nghiệp TOP đầu
            </h2>
            <p className="portal-section__subtitle">
              Những nơi có nhịp tuyển dụng rõ ràng, đủ chỉn chu và đáng để bạn
              dành thời gian theo dõi kỹ hơn.
            </p>
          </div>
          <div className="portal-section__actions">
            <Link className="portal-section__link" to="/companies">
              Xem tất cả
            </Link>
            <div className="portal-carousel-nav">
              <button
                aria-label="Xem nhóm doanh nghiệp trước"
                className="portal-carousel-nav__button"
                onClick={() => handleCompanyPage(-1)}
                type="button"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Xem nhóm doanh nghiệp tiếp theo"
                className="portal-carousel-nav__button"
                onClick={() => handleCompanyPage(1)}
                type="button"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {state.loading ? (
          <div className="portal-company-grid">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="panel" key={index}>
                <SkeletonBlock
                  lines={4}
                  title="Đang tổng hợp doanh nghiệp đáng theo dõi..."
                />
              </div>
            ))}
          </div>
        ) : featuredCompanies.length ? (
          <div className="portal-company-carousel portal-company-carousel--stream">
            <div className="portal-company-carousel__viewport">
              <div
                className="portal-company-carousel__slider"
                ref={companySliderRef}
                style={{
                  transform: `translateX(-${activeCompanyIndex * companyStep}px)`,
                  transition: companyTransitionEnabled
                    ? "transform 560ms ease"
                    : "none",
                }}
              >
                {companyLoopItems.map((company, index) => (
                  <Link
                    className="portal-company-spotlight"
                    key={`${company.userId}-${index}`}
                    to={`/companies/${company.userId}`}
                  >
                    <CompanyLogo
                      className="portal-company-spotlight__logo"
                      companyName={company.companyName}
                      logoUrl={company.logoUrl}
                    />
                    <strong>{company.companyName}</strong>
                    <p>{getCompanyPresence(company)}</p>
                    <div className="portal-company-spotlight__chips">
                      <span>
                        {formatCompactNumber(company.openJobs || 0)} việc làm
                      </span>
                      <span>{getCompanyTrustLabel(company)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {featuredCompanies.length > COMPANY_VISIBLE_CARDS ? (
              <div className="portal-company-carousel__dots">
                {Array.from({ length: companyMaxIndex + 1 }).map((_, index) => (
                  <button
                    aria-label={`Chuyển đến thẻ doanh nghiệp ${index + 1}`}
                    className={`portal-company-carousel__dot${index === activeCompanyIndex ? " is-active" : ""}`}
                    key={index}
                    onClick={() => setActiveCompanyIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState
            description="Khi có thêm doanh nghiệp công khai hồ sơ và vị trí tuyển dụng, khu vực này sẽ giúp bạn nhìn ra những nơi đáng theo dõi hơn."
            title="Doanh nghiệp nổi bật đang được chuẩn bị"
          />
        )}
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">
              Bắt đầu từ vài bước thật nhẹ
            </h2>
            <p className="portal-section__subtitle">
              Không cần lướt quá nhiều, chỉ cần đi đúng nhịp là bạn đã gần hơn
              với một cơ hội phù hợp.
            </p>
          </div>
        </div>

        <div className="portal-story-grid">
          {homeJourneySteps.map((step, index) => (
            <article className="portal-story-card" key={step.title}>
              <span className="portal-story-card__index">0{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">Danh mục nổi bật</h2>
            <p className="portal-section__subtitle">
              Chọn nhanh nhóm ngành đang được quan tâm để rút ngắn thời gian tìm
              kiếm ngay từ đầu.
            </p>
          </div>
          <Link className="portal-section__link" to="/jobs">
            Xem tất cả ngành nghề
          </Link>
        </div>

        <div className="portal-category-board">
          {categoryHighlights.map((category) => (
            <button
              className="portal-category-tile"
              key={category.id}
              onClick={() =>
                navigate(buildJobsUrl({ categoryId: String(category.id) }))
              }
              type="button"
            >
              <div className="portal-category-tile__icon">
                <CategoryIcon
                  categoryName={category.name}
                  size={20}
                  strokeWidth={2}
                />
              </div>
              <strong>{category.name}</strong>
              <span>
                {category.openCount
                  ? `${formatCompactNumber(category.openCount)} vị trí đang mở`
                  : "Đang có thêm cơ hội mới được cập nhật"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">
              Khám phá nhanh theo nhu cầu
            </h2>
            <p className="portal-section__subtitle">
              Đi thẳng vào kiểu cơ hội bạn đang cần mà không phải lọc lại từ
              đầu.
            </p>
          </div>
          <Link className="portal-section__link" to="/jobs">
            Mở toàn bộ việc làm
          </Link>
        </div>

        <div className="portal-discovery-grid">
          <article className="portal-discovery-card">
            <div className="portal-discovery-card__head">
              <strong>Việc làm theo địa điểm</strong>
              <span>Chọn nhanh khu vực bạn muốn ưu tiên</span>
            </div>
            <div className="portal-discovery-card__body">
              <div className="portal-discovery-card__caption">
                Địa điểm nổi bật
              </div>
              <div className="portal-discovery-card__chips">
                {quickLocations.map((location) => (
                  <button
                    className="portal-discovery-chip"
                    key={location}
                    onClick={() => navigate(buildJobsUrl({ location }))}
                    type="button"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </article>

          <article className="portal-discovery-card">
            <div className="portal-discovery-card__head">
              <strong>Nhóm ngành được quan tâm</strong>
              <span>Bắt đầu từ lĩnh vực bạn đã có định hướng</span>
            </div>
            <div className="portal-discovery-card__body">
              <div className="portal-discovery-card__caption">
                Danh mục gợi ý
              </div>
              <div className="portal-discovery-card__chips">
                {spotlightCategories.length ? (
                  spotlightCategories.map((category) => (
                    <button
                      className="portal-discovery-chip"
                      key={category.id}
                      onClick={() =>
                        navigate(
                          buildJobsUrl({ categoryId: String(category.id) }),
                        )
                      }
                      type="button"
                    >
                      <CategoryIcon
                        categoryName={category.name}
                        size={14}
                        strokeWidth={2}
                      />
                      {category.name}
                    </button>
                  ))
                ) : (
                  <div className="portal-discovery-card__empty">
                    Danh mục sẽ hiển thị đầy hơn khi dữ liệu ngành nghề được cập
                    nhật thêm.
                  </div>
                )}
              </div>
            </div>
          </article>

          <article className="portal-discovery-card portal-discovery-card--soft">
            <div className="portal-discovery-card__head">
              <strong>Lối tắt hay dùng</strong>
              <span>Những nhu cầu tìm việc thường gặp nhất</span>
            </div>
            <div className="portal-discovery-list">
              {quickNeeds.map((item) => (
                <button
                  className="portal-discovery-link"
                  key={item.label}
                  onClick={() => navigate(buildJobsUrl(item.params))}
                  type="button"
                >
                  <span>{item.label}</span>
                  <small>Xem ngay</small>
                </button>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">Cẩm nang bắt đầu nhanh</h2>
            <p className="portal-section__subtitle">
              Vài điểm chạm ngắn nhưng đủ ích để bạn không rơi vào cảm giác tìm
              việc lan man.
            </p>
          </div>
        </div>

        <div className="portal-guide-grid">
          {homeGuides.map((item) => (
            <article className="portal-guide-card" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              {item.to ? (
                <Link className="portal-guide-card__link" to={item.to}>
                  {item.cta}
                </Link>
              ) : (
                <button
                  className="portal-guide-card__link portal-guide-card__link--button"
                  onClick={() => handleGuideAction(item.action)}
                  type="button"
                >
                  {item.cta}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section portal-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">Việc làm nổi bật hôm nay</h2>
            <p className="portal-section__subtitle">
              Những vị trí có cách thể hiện rõ ràng hơn để bạn sớm nhận ra đâu
              là cơ hội nên dành thời gian.
            </p>
          </div>
          <Link className="portal-section__link" to="/jobs">
            Xem tất cả
          </Link>
        </div>

        {state.loading ? (
          <div className="portal-job-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="panel" key={index}>
                <SkeletonBlock
                  lines={5}
                  title="Đang chọn ra những vị trí đáng xem nhất..."
                />
              </div>
            ))}
          </div>
        ) : state.error ? (
          <ErrorState description={state.error} />
        ) : featuredJobs.length ? (
          <div className="portal-job-grid portal-job-grid--four">
            {featuredJobs.map((job) => (
              <article
                className="portal-job-card portal-job-card--rich"
                key={job.id}
              >
                <div className="portal-job-card__top">
                  <CompanyLogo
                    className="portal-job-card__logo"
                    companyName={job.employer?.companyName}
                    logoUrl={job.employer?.logoUrl}
                  />
                  <span className="tag">
                    {job.category?.name || titleizeEnum(job.jobType)}
                  </span>
                </div>
                <div className="portal-job-card__body">
                  <h3>
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                  </h3>
                  <p>
                    {pickFirstMeaningful(job.employer?.companyName) ||
                      "Doanh nghiệp đang hoàn thiện hồ sơ tuyển dụng"}
                  </p>
                  <div className="portal-job-card__tags">
                    <span>
                      {pickFirstMeaningful(job.location) ||
                        "Linh hoạt địa điểm"}
                    </span>
                    <span>{titleizeEnum(job.level)}</span>
                  </div>
                  <p className="portal-job-card__insight">
                    {getJobReasonToCare(job)}
                  </p>
                </div>
                <div className="portal-job-card__meta">
                  <strong>
                    {formatCurrencyRange(job.salaryMin, job.salaryMax)}
                  </strong>
                  <span>
                    {job.deadline
                      ? `Hạn nộp ${job.deadline}`
                      : "Vẫn đang chờ những hồ sơ phù hợp"}
                  </span>
                </div>
                <div className="portal-job-card__actions">
                  <Link
                    className="button button--primary portal-job-card__apply"
                    to={`/jobs/${job.id}`}
                  >
                    Ứng tuyển ngay
                  </Link>
                  <Link
                    className="button button--secondary portal-job-card__save-action"
                    to="/login"
                  >
                    Lưu để cân nhắc
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Khi có thêm dữ liệu tuyển dụng công khai, những vị trí đáng chú ý sẽ xuất hiện ở đây để bạn bắt đầu nhanh hơn."
            title="Hôm nay chưa có vị trí nổi bật"
          />
        )}
      </section>

      <section className="section">
        <div className="portal-employer-band portal-employer-band--warm">
          <div className="portal-employer-band__copy">
            <span className="portal-employer-band__eyebrow">
              Dành cho nhà tuyển dụng
            </span>
            <h2>
              Một tin tuyển dụng chỉn chu luôn dễ chạm tới đúng người hơn.
            </h2>
            <p className="portal-employer-band__lead">
              Khi cơ hội được kể đủ rõ và đủ tinh tế, ứng viên phù hợp sẽ chủ
              động ở lại tìm hiểu thay vì lướt qua quá nhanh.
            </p>
            <div className="portal-employer-band__list">
              {employerValuePoints.map((point) => (
                <div key={point.title}>
                  <strong>{point.title}</strong>
                  <span>{point.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-employer-band__panel">
            <div className="portal-employer-band__metric">
              <strong>Tìm được ứng viên phù hợp</strong>
              <span>
                Thông tin rõ ràng giúp doanh nghiệp sớm thu hút những ứng viên
                thật sự quan tâm, thay vì nhận quá nhiều hồ sơ hời hợt.
              </span>
            </div>
            <div className="portal-employer-band__metric">
              <strong>Theo dõi dễ dàng</strong>
              <span>
                Mọi bước từ hồ sơ công ty đến tin đăng và danh sách ứng viên
                được giữ cùng một nhịp, để đội tuyển dụng đỡ rối khi vận hành.
              </span>
            </div>
            <div className="button-row">
              <Button to="/register?role=EMPLOYER" variant="primary">
                Đăng ký nhà tuyển dụng
              </Button>
              <Button to="/employers" variant="secondary">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section portal-section portal-career-guide-section">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">Cẩm nang nghề nghiệp</h2>
            <p className="portal-section__subtitle">
              Những gợi ý ngắn gọn nhưng đúng lúc để bạn tìm việc tỉnh táo hơn,
              chuẩn bị hồ sơ tốt hơn và tự tin hơn trước mỗi cơ hội mới.
            </p>
          </div>
          <Link className="portal-section__link" to="/jobs">
            Xem thêm cơ hội
          </Link>
        </div>

        <div className="portal-career-guide-grid">
          {careerGuideItems.map((item, index) => (
            <article className="portal-career-guide-card" key={item.title}>
              <span className="portal-career-guide-card__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="portal-career-guide-card__content">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section portal-section portal-career-guide-section portal-career-guide-section--enhanced">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">Cẩm nang nghề nghiệp</h2>
            <p className="portal-section__subtitle">
              Những gợi ý ngắn gọn nhưng đúng lúc để bạn tìm việc tỉnh táo hơn,
              chuẩn bị hồ sơ tốt hơn và tự tin hơn trước mỗi cơ hội mới.
            </p>
          </div>
          <div className="portal-section__actions">
            <Link className="portal-section__link" to="/jobs">
              Xem thêm cơ hội
            </Link>
            <div className="portal-carousel-nav">
              <button
                aria-label="Xem nhóm cẩm nang trước"
                className="portal-carousel-nav__button"
                onClick={() => handleCareerGuidePage(-1)}
                type="button"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Xem nhóm cẩm nang tiếp theo"
                className="portal-carousel-nav__button"
                onClick={() => handleCareerGuidePage(1)}
                type="button"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="portal-career-guide-slider">
          <div
            className="portal-career-guide-slider__track"
            style={{
              width: `${careerGuidePages.length * 100}%`,
              transform: `translateX(-${activeCareerGuidePage * (100 / careerGuidePages.length)}%)`,
            }}
          >
            {careerGuidePages.map((page, pageIndex) => (
              <div className="portal-career-guide-slider__page" key={pageIndex}>
                <div className="portal-career-guide-grid">
                  {page.map((item, itemIndex) => {
                    const absoluteIndex =
                      pageIndex * CAREER_GUIDES_PER_PAGE + itemIndex;
                    return (
                      <article
                        className="portal-career-guide-card"
                        key={item.title}
                      >
                        <span className="portal-career-guide-card__index">
                          {String(
                            (absoluteIndex % careerGuideDeck.length) + 1,
                          ).padStart(2, "0")}
                        </span>
                        <div className="portal-career-guide-card__content">
                          <div className="portal-career-guide-card__meta">
                            <span className="portal-career-guide-card__topic">
                              {item.topic}
                            </span>
                            <time>{item.publishedAt}</time>
                          </div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {careerGuidePages.length > 1 ? (
            <div className="portal-career-guide-slider__dots">
              {careerGuidePages.map((_, index) => (
                <button
                  aria-label={`Chuyển đến nhóm cẩm nang ${index + 1}`}
                  className={`portal-career-guide-slider__dot${index === activeCareerGuidePage ? " is-active" : ""}`}
                  key={index}
                  onClick={() => setActiveCareerGuidePage(index)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section portal-section portal-career-guide-section portal-career-guide-section--joboko">
        <div className="portal-section__header">
          <div>
            <h2 className="portal-section__title">Cẩm nang nghề nghiệp</h2>
            <p className="portal-section__subtitle">
              Gói lại những kinh nghiệm tìm việc, chỉnh CV và chuẩn bị phỏng vấn
              theo cách ngắn gọn, dễ đọc và đủ hữu ích để bạn áp dụng ngay.
            </p>
          </div>
          <div className="portal-section__actions">
            <div className="portal-carousel-nav">
              <button
                aria-label="Xem nhóm cẩm nang trước"
                className="portal-carousel-nav__button"
                onClick={() => handleCareerGuidePage(-1)}
                type="button"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Xem nhóm cẩm nang tiếp theo"
                className="portal-carousel-nav__button"
                onClick={() => handleCareerGuidePage(1)}
                type="button"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="portal-career-guide-slider">
          <div
            className="portal-career-guide-slider__track"
            style={{
              width: `${careerGuidePages.length * 100}%`,
              transform: `translateX(-${activeCareerGuidePage * (100 / careerGuidePages.length)}%)`,
            }}
          >
            {careerGuidePages.map((page, pageIndex) => (
              <div
                className="portal-career-guide-slider__page"
                key={`joboko-${pageIndex}`}
                style={{
                  flex: `0 0 ${100 / careerGuidePages.length}%`,
                  width: `${100 / careerGuidePages.length}%`,
                }}
              >
                <div className="portal-career-guide-grid">
                  {page.map((item, itemIndex) => {
                    const absoluteIndex =
                      pageIndex * CAREER_GUIDES_PER_PAGE + itemIndex;
                    const displayIndex =
                      (absoluteIndex % careerGuideDeck.length) + 1;

                    return (
                      <article
                        className="portal-career-guide-card"
                        key={`joboko-${item.title}`}
                      >
                        <span className="portal-career-guide-card__index">
                          {String(displayIndex).padStart(2, "0")}
                        </span>
                        <div className="portal-career-guide-card__content">
                          <div className="portal-career-guide-card__meta">
                            <span className="portal-career-guide-card__topic">
                              {item.topic}
                            </span>
                            <time>{item.publishedAt}</time>
                          </div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {careerGuidePages.length > 1 ? (
            <div className="portal-career-guide-slider__dots">
              {careerGuidePages.map((_, index) => (
                <button
                  aria-label={`Chuyển đến nhóm cẩm nang ${index + 1}`}
                  className={`portal-career-guide-slider__dot${index === activeCareerGuidePage % careerGuidePages.length ? " is-active" : ""}`}
                  key={`joboko-dot-${index}`}
                  onClick={() => setActiveCareerGuidePage(index)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
