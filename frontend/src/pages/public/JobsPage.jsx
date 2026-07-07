import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getCategories } from "@/api/categoryApi";
import { getPublicJobs } from "@/api/jobApi";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CompanyLogo } from "@/components/companyLogo";
import {
  EmptyState,
  ErrorState,
  Pagination,
  SkeletonBlock,
} from "@/components/ui";
import {
  getJobDeadlineLine,
  getJobReasonToCare,
  isMeaningfulValue,
  pickFirstMeaningful,
  popularSearchKeywords,
} from "@/content/siteCopy";
import {
  formatCompactNumber,
  formatCurrencyRange,
  titleizeEnum,
} from "@/utils/format";

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [draftFilters, setDraftFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    categoryId: searchParams.get("categoryId") || "",
  });
  const [state, setState] = useState({
    loading: true,
    error: "",
    pageData: null,
  });

  const filters = {
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    jobType: searchParams.get("jobType") || "",
    level: searchParams.get("level") || "",
    categoryId: searchParams.get("categoryId") || "",
    page: Number(searchParams.get("page") || "0"),
  };

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setDraftFilters({
      keyword: filters.keyword,
      location: filters.location,
      categoryId: filters.categoryId,
    });
  }, [filters.keyword, filters.location, filters.categoryId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setState((current) => ({ ...current, loading: true, error: "" }));
      try {
        const response = await getPublicJobs({
          ...filters,
          categoryId: filters.categoryId || undefined,
          jobType: filters.jobType || undefined,
          level: filters.level || undefined,
        });

        if (!ignore) {
          setState({
            loading: false,
            error: "",
            pageData: response,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error:
              error.response?.data?.message ||
              "Danh sách việc làm đang cần thêm một chút thời gian để sắp xếp lại cho bạn.",
            pageData: null,
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [
    filters.keyword,
    filters.location,
    filters.jobType,
    filters.level,
    filters.categoryId,
    filters.page,
  ]);

  function handleFilterChange(key, value) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.delete("page");
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);

    if (draftFilters.keyword) next.set("keyword", draftFilters.keyword);
    else next.delete("keyword");

    if (draftFilters.location) next.set("location", draftFilters.location);
    else next.delete("location");

    if (draftFilters.categoryId)
      next.set("categoryId", draftFilters.categoryId);
    else next.delete("categoryId");

    next.delete("page");
    setSearchParams(next);
  }

  function handleQuickKeyword(keyword) {
    const next = new URLSearchParams(searchParams);
    next.set("keyword", keyword);
    next.delete("page");
    setSearchParams(next);
  }

  function handlePageChange(page) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  }

  const activeFilterCount = useMemo(
    () =>
      [
        filters.keyword,
        filters.location,
        filters.jobType,
        filters.level,
        filters.categoryId,
      ].filter(Boolean).length,
    [
      filters.keyword,
      filters.location,
      filters.jobType,
      filters.level,
      filters.categoryId,
    ],
  );

  return (
    <>
      <section className="portal-page-hero portal-page-hero--light portal-page-hero--jobboard">
        <div className="portal-page-hero__inner">
          <div className="portal-page-hero__copy">
            <span className="portal-page-hero__eyebrow">
              Việc làm mới được cập nhật
            </span>
            <h1>Tìm kiếm các cơ hội việc làm phù hợp cho bạn.</h1>
            <p>
              Dưới đây là danh sách chi tiết các việc được cập nhật liên tục.
            </p>
          </div>
    
          <form
            className="portal-filter-shell portal-filter-shell--top"
            onSubmit={handleSearchSubmit}
          >
            <div className="portal-filter-shell__grid portal-filter-shell__grid--top">
              <input
                className="portal-search__control"
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    keyword: event.target.value,
                  }))
                }
                placeholder="Tên công việc, vị trí, kỹ năng..."
                value={draftFilters.keyword}
              />
              <input
                className="portal-search__control"
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                placeholder="Địa điểm làm việc..."
                value={draftFilters.location}
              />
              <select
                className="portal-search__control"
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    categoryId: event.target.value,
                  }))
                }
                value={draftFilters.categoryId}
              >
                <option value="">Tất cả ngành</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button className="portal-search__button" type="submit">
                Tìm kiếm
              </button>
            </div>
          </form>

          <div className="portal-keyword-row">
            <span>Từ khóa phổ biến:</span>
            {popularSearchKeywords.map((keyword) => (
              <button
                className="portal-keyword-chip"
                key={keyword}
                onClick={() => handleQuickKeyword(keyword)}
                type="button"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section portal-jobs-shell">
        <aside className="portal-sidebar portal-sidebar--comfortable">
          <div className="portal-sidebar__group">
            <strong>Cấp bậc</strong>
            <label className="portal-sidebar__option">
              <input
                checked={filters.level === "JUNIOR"}
                onChange={() =>
                  handleFilterChange(
                    "level",
                    filters.level === "JUNIOR" ? "" : "JUNIOR",
                  )
                }
                type="checkbox"
              />
              <span>Nhân viên / Thực tập sinh</span>
            </label>
            <label className="portal-sidebar__option">
              <input
                checked={filters.level === "MIDDLE"}
                onChange={() =>
                  handleFilterChange(
                    "level",
                    filters.level === "MIDDLE" ? "" : "MIDDLE",
                  )
                }
                type="checkbox"
              />
              <span>Đã có kinh nghiệm</span>
            </label>
            <label className="portal-sidebar__option">
              <input
                checked={filters.level === "MANAGER"}
                onChange={() =>
                  handleFilterChange(
                    "level",
                    filters.level === "MANAGER" ? "" : "MANAGER",
                  )
                }
                type="checkbox"
              />
              <span>Trưởng nhóm / Quản lý</span>
            </label>
          </div>

          <div className="portal-sidebar__group">
            <strong>Loại hình công việc</strong>
            <label className="portal-sidebar__option">
              <input
                checked={filters.jobType === "FULLTIME"}
                onChange={() =>
                  handleFilterChange(
                    "jobType",
                    filters.jobType === "FULLTIME" ? "" : "FULLTIME",
                  )
                }
                type="checkbox"
              />
              <span>Toàn thời gian</span>
            </label>
            <label className="portal-sidebar__option">
              <input
                checked={filters.jobType === "REMOTE"}
                onChange={() =>
                  handleFilterChange(
                    "jobType",
                    filters.jobType === "REMOTE" ? "" : "REMOTE",
                  )
                }
                type="checkbox"
              />
              <span>Từ xa</span>
            </label>
          </div>

          <div className="portal-sidebar__group">
            <strong>Danh mục</strong>
            {categories.slice(0, 6).map((category) => (
              <label className="portal-sidebar__option" key={category.id}>
                <input
                  checked={filters.categoryId === String(category.id)}
                  onChange={() =>
                    handleFilterChange(
                      "categoryId",
                      filters.categoryId === String(category.id)
                        ? ""
                        : String(category.id),
                    )
                  }
                  type="checkbox"
                />
                <span className="portal-sidebar__option-copy">
                  <CategoryIcon
                    categoryName={category.name}
                    size={15}
                    strokeWidth={2.2}
                  />
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </aside>

        <div className="portal-jobs-main">
          {state.loading ? (
            <div className="portal-job-list">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="panel" key={index}>
                  <SkeletonBlock
                    lines={5}
                    title="Đang sắp xếp những cơ hội phù hợp hơn cho bạn..."
                  />
                </div>
              ))}
            </div>
          ) : state.error ? (
            <ErrorState description={state.error} />
          ) : state.pageData?.content?.length ? (
            <div className="stack">
              <div className="portal-results-bar portal-results-bar--rich">
                <div className="results-meta">
                  <strong>
                    {formatCompactNumber(state.pageData.totalElements)}
                  </strong>
                  <span>
                    việc làm phù hợp hơn đang hiển thị
                    {activeFilterCount
                      ? ` • ${activeFilterCount} bộ lọc đang được áp dụng`
                      : ""}
                  </span>
                </div>
                <select
                  className="portal-results-bar__sort"
                  defaultValue="updated"
                >
                  <option value="updated">Ưu tiên việc mới cập nhật</option>
                  <option value="salary">Ưu tiên mức lương nổi bật</option>
                </select>
              </div>

              <div className="portal-job-list">
                {state.pageData.content.map((job) => (
                  <article
                    className="portal-job-listing portal-job-listing--rich"
                    key={job.id}
                  >
                    <div className="portal-job-listing__main">
                      <CompanyLogo
                        className="portal-job-listing__logo"
                        companyName={job.employer?.companyName}
                        logoUrl={job.employer?.logoUrl}
                      />
                      <div className="portal-job-listing__copy">
                        <div className="portal-job-listing__headline">
                          <h3>
                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                          <span className="tag">
                            {job.category?.name || titleizeEnum(job.jobType)}
                          </span>
                        </div>
                        <p>
                          {pickFirstMeaningful(job.employer?.companyName) ||
                            "Doanh nghiệp đang hoàn thiện hồ sơ tuyển dụng"}
                        </p>
                        <div className="portal-job-listing__meta">
                          <span>
                            {pickFirstMeaningful(job.location) ||
                              "Linh hoạt địa điểm"}
                          </span>
                          <span>{titleizeEnum(job.level)}</span>
                          {isMeaningfulValue(job.jobType) ? (
                            <span>{titleizeEnum(job.jobType)}</span>
                          ) : null}
                        </div>
                        <p className="portal-job-listing__insight">
                          {getJobReasonToCare(job)}
                        </p>
                      </div>
                    </div>
                    <div className="portal-job-listing__side">
                      <strong>
                        {formatCurrencyRange(job.salaryMin, job.salaryMax)}
                      </strong>
                      <span>{getJobDeadlineLine(job)}</span>
                      <div className="portal-job-listing__actions">
                        <Link
                          className="button button--primary"
                          to={`/jobs/${job.id}`}
                        >
                          Ứng tuyển ngay
                        </Link>
                        <Link className="button button--secondary" to="/login">
                          Lưu lại
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Pagination
                onPageChange={handlePageChange}
                page={state.pageData.page}
                totalPages={state.pageData.totalPages}
              />
            </div>
          ) : (
            <EmptyState
              description="Bạn thử nới rộng địa điểm, bớt một vài bộ lọc hoặc chuyển sang nhóm ngành gần hơn với định hướng hiện tại nhé."
              title="Chưa thấy cơ hội thật sự hợp với bạn"
            />
          )}
        </div>
      </section>
    </>
  );
}
