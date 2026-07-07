import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobById, getPublicJobs } from "@/api/jobApi";
import { CompanyLogo } from "@/components/companyLogo";
import { EmptyState, ErrorState, SkeletonBlock, StatusBadge } from "@/components/ui";
import { getCompanyTagline, getCompanyTrustLabel, getJobDeadlineLine, getJobReasonToCare, getNaturalFallback, isMeaningfulValue, pickFirstMeaningful } from "@/content/siteCopy";
import { formatCurrencyRange, formatDate, splitMultilineText, titleizeEnum } from "@/utils/format";

function renderLines(text, fallback) {
  const lines = splitMultilineText(text);

  if (!lines.length) {
    return <p className="muted">{fallback}</p>;
  }

  return (
    <ul className="portal-detail-list">
      {lines.map((line, index) => (
        <li key={index}>{line}</li>
      ))}
    </ul>
  );
}

function buildMapUrl(location) {
  const query = encodeURIComponent(location || "Viet Nam");
  return `https://www.google.com/maps?q=${query}&z=14&output=embed`;
}

export function JobDetailPage() {
  const { jobId } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: "",
    job: null,
    similarJobs: [],
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const job = await getJobById(jobId);
        const related = await getPublicJobs({
          categoryId: job.category?.id,
          location: job.location || undefined,
          page: 0,
          size: 4,
        });

        if (!ignore) {
          setState({
            loading: false,
            error: "",
            job,
            similarJobs: related.content.filter((item) => item.id !== job.id).slice(0, 3),
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Chi tiết công việc đang tạm chưa mở ra được. Bạn thử quay lại danh sách để chọn một vị trí khác nhé.",
            job: null,
            similarJobs: [],
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [jobId]);

  const mapUrl = useMemo(() => buildMapUrl(state.job?.location), [state.job?.location]);

  if (state.loading) {
    return (
      <section className="section">
        <div className="portal-detail-layout">
          <div className="panel">
            <SkeletonBlock lines={8} title="Đang mở chi tiết vị trí để bạn xem kỹ hơn..." />
          </div>
          <div className="panel">
            <SkeletonBlock lines={5} title="Đang chuẩn bị thông tin doanh nghiệp..." />
          </div>
        </div>
      </section>
    );
  }

  if (state.error || !state.job) {
    return (
      <section className="section">
        <ErrorState description={state.error || "Không tìm thấy công việc này trong dữ liệu hiện tại."} />
      </section>
    );
  }

  const { job } = state;

  return (
    <section className="section">
      <div className="portal-detail-layout">
        <div className="portal-detail-main">
          <div className="portal-detail-summary portal-detail-summary--joboko">
            <div className="portal-detail-summary__head">
              <div className="stack stack--xs">
                <span className="section-kicker">Việc làm đang tuyển</span>
                <h1>{job.title}</h1>
                <p>
                  {pickFirstMeaningful(job.employer?.companyName) || "Doanh nghiệp đang hoàn thiện hồ sơ tuyển dụng"} •{" "}
                  {pickFirstMeaningful(job.location) || "Linh hoạt theo nhu cầu công việc"}
                </p>
              </div>
              <div className="portal-detail-summary__badges">
                {job.category?.name ? <span className="tag">{job.category.name}</span> : null}
                {isMeaningfulValue(job.jobType) ? <span className="tag">{titleizeEnum(job.jobType)}</span> : null}
                {isMeaningfulValue(job.level) ? <span className="tag">{titleizeEnum(job.level)}</span> : null}
                {job.status ? <StatusBadge value={job.status} /> : null}
              </div>
            </div>

            <div className="portal-detail-facts-grid">
              <div>
                <strong>{formatCurrencyRange(job.salaryMin, job.salaryMax)}</strong>
                <span>Mức lương</span>
              </div>
              <div>
                <strong>{pickFirstMeaningful(job.location) || "Linh hoạt"}</strong>
                <span>Địa điểm</span>
              </div>
              <div>
                <strong>{titleizeEnum(job.jobType)}</strong>
                <span>Loại hình</span>
              </div>
              <div>
                <strong>{job.deadline ? formatDate(job.deadline) : "Chưa chốt hạn"}</strong>
                <span>Hạn nộp</span>
              </div>
            </div>

            <div className="portal-detail-highlight">
              <strong>Điểm đáng chú ý</strong>
              <p>{getJobReasonToCare(job)}</p>
            </div>
          </div>

          <div className="portal-detail-content">
            <section className="portal-detail-section">
              <h2>Mô tả công việc</h2>
              {renderLines(job.description, getNaturalFallback("jobDescription"))}
            </section>

            <section className="portal-detail-section">
              <h3>Yêu cầu ứng viên</h3>
              {renderLines(job.requirements, getNaturalFallback("jobRequirements"))}
            </section>

            <section className="portal-detail-section">
              <h3>Quyền lợi được nhận</h3>
              {renderLines(job.benefits, getNaturalFallback("jobBenefits"))}
            </section>

            <section className="portal-detail-section">
              <h3>Địa điểm làm việc</h3>
              <p>{pickFirstMeaningful(job.location) || "Địa điểm cụ thể sẽ được chia sẻ thêm trong quá trình trao đổi với ứng viên phù hợp."}</p>
              <div className="portal-detail-map">
                <iframe allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapUrl} title={`Bản đồ địa điểm làm việc ${pickFirstMeaningful(job.location) || "Việt Nam"}`} />
              </div>
            </section>
          </div>
        </div>

        <aside className="portal-detail-sidebar">
          <div className="portal-side-card portal-side-card--cta">
            <strong>{formatCurrencyRange(job.salaryMin, job.salaryMax)}</strong>
            <span>{getJobDeadlineLine(job)}</span>
            <Link className="button button--primary button--detail-apply" to="/login">
              Ứng tuyển ngay
            </Link>
            <Link className="button button--secondary" to="/login">
              Lưu việc làm
            </Link>
          </div>

          <div className="portal-side-card">
            <div className="portal-side-card__company">
              <CompanyLogo className="portal-side-card__logo" companyName={job.employer?.companyName} logoUrl={job.employer?.logoUrl} />
              <div className="stack stack--xs">
                <strong>{pickFirstMeaningful(job.employer?.companyName) || "Doanh nghiệp đang hoàn thiện hồ sơ"}</strong>
                <span>{getCompanyTrustLabel(job.employer)}</span>
              </div>
            </div>
            <div className="portal-side-card__facts">
              <span>{getCompanyTagline(job.employer)}</span>
              <span>{pickFirstMeaningful(job.location) || "Linh hoạt địa điểm"}</span>
              <span>{pickFirstMeaningful(job.category?.name) || "Nhóm ngành đang được bổ sung thêm"}</span>
            </div>
            {job.employer?.id ? (
              <Link className="button button--secondary" to={`/companies/${job.employer.id}`}>
                Xem hồ sơ công ty
              </Link>
            ) : null}
          </div>

          <div className="portal-side-card">
            <div className="portal-side-card__header">
              <strong>Việc làm tương tự</strong>
            </div>
            {state.similarJobs.length ? (
              <div className="portal-related-list">
                {state.similarJobs.map((item) => (
                  <Link className="portal-related-item" key={item.id} to={`/jobs/${item.id}`}>
                    <strong>{item.title}</strong>
                    <span>{pickFirstMeaningful(item.employer?.companyName) || "Doanh nghiệp đang hoàn thiện hồ sơ"}</span>
                    <small>{formatCurrencyRange(item.salaryMin, item.salaryMax)}</small>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState description="Khi dữ liệu cùng nhóm ngành hoặc cùng khu vực đầy hơn, hệ thống sẽ gợi ý thêm những vị trí đáng so sánh tại đây." title="Chưa có vị trí tương tự để gợi ý" />
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
