import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCompanyProfile } from "@/api/employerApi";
import { getPublicJobs } from "@/api/jobApi";
import { CompanyLogo } from "@/components/companyLogo";
import { EmptyState, ErrorState, SkeletonBlock } from "@/components/ui";
import { getCompanyPresence, getCompanyTagline, getCompanyTrustLabel, getNaturalFallback, isMeaningfulValue, pickFirstMeaningful } from "@/content/siteCopy";
import { formatCompactNumber } from "@/utils/format";

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: "",
    company: null,
    jobs: [],
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [company, jobsResponse] = await Promise.all([getCompanyProfile(companyId), getPublicJobs({ page: 0, size: 40 })]);

        if (!ignore) {
          setState({
            loading: false,
            error: "",
            company,
            jobs: jobsResponse.content.filter((job) => job.employer?.id === Number(companyId)),
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Trang công ty đang tạm chưa mở ra được. Bạn thử quay lại danh sách doanh nghiệp nhé.",
            company: null,
            jobs: [],
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [companyId]);

  if (state.loading) {
    return (
      <section className="section">
        <div className="panel">
          <SkeletonBlock lines={8} title="Đang chuẩn bị hồ sơ doanh nghiệp..." />
        </div>
      </section>
    );
  }

  if (state.error || !state.company) {
    return (
      <section className="section">
        <ErrorState description={state.error || "Không tìm thấy công ty này trong dữ liệu hiện tại."} />
      </section>
    );
  }

  const { company } = state;
  const openJobs = state.jobs.length;

  const companyFacts = useMemo(
    () =>
      [
        { label: "Quy mô", value: pickFirstMeaningful(company.companySize) },
        { label: "Địa điểm", value: pickFirstMeaningful(company.address) },
        { label: "Website", value: pickFirstMeaningful(company.website) },
        { label: "Người liên hệ", value: pickFirstMeaningful(company.fullName) },
        { label: "Email liên hệ", value: pickFirstMeaningful(company.email) },
      ].filter((item) => isMeaningfulValue(item.value)),
    [company.address, company.companySize, company.email, company.fullName, company.website]
  );

  const summaryFacts = [
    { value: `${formatCompactNumber(openJobs)}`, label: "Vị trí đang mở" },
    { value: pickFirstMeaningful(company.companySize), label: "Quy mô" },
    { value: pickFirstMeaningful(company.address), label: "Địa điểm" },
    { value: company.approved ? "Đã xác minh" : "Đang hoàn thiện", label: "Trạng thái hồ sơ" },
  ].filter((item) => isMeaningfulValue(item.value));

  return (
    <section className="section">
      <div className="portal-detail-layout">
        <div className="portal-detail-main">
          <article className="portal-detail-summary portal-detail-summary--company">
            <div className="portal-detail-summary__head">
              <div className="stack stack--xs">
                <span className="section-kicker">{getCompanyTrustLabel(company)}</span>
                <h1>{pickFirstMeaningful(company.companyName) || "Doanh nghiệp đang hoàn thiện hồ sơ"}</h1>
                <p>{getCompanyTagline(company, openJobs)}</p>
              </div>
              <CompanyLogo className="portal-company-mark" companyName={company.companyName} logoUrl={company.logoUrl} />
            </div>

            <div className="portal-detail-facts-grid">
              {summaryFacts.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="portal-detail-highlight">
              <strong>Vì sao nên theo dõi doanh nghiệp này?</strong>
              <p>{pickFirstMeaningful(company.companyDescription) || getNaturalFallback("companyDescription")}</p>
            </div>
          </article>

          <article className="portal-detail-content">
            <section className="portal-detail-section">
              <h2>Giới thiệu doanh nghiệp</h2>
              <p>{pickFirstMeaningful(company.companyDescription) || getNaturalFallback("companyDescription")}</p>
            </section>

            <section className="portal-detail-section">
              <h2>Thông tin đáng chú ý</h2>
              {companyFacts.length ? (
                <ul className="portal-detail-list">
                  {companyFacts.map((fact) => (
                    <li key={fact.label}>
                      {fact.label}: {fact.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{getNaturalFallback("companyDescription")}</p>
              )}
            </section>

            <section className="portal-detail-section">
              <h2>Vị trí đang tuyển</h2>
              {openJobs ? (
                <div className="portal-company-openings">
                  {state.jobs.map((job) => (
                    <Link className="portal-related-item portal-related-item--job" key={job.id} to={`/jobs/${job.id}`}>
                      <strong>{job.title}</strong>
                      <span>{pickFirstMeaningful(job.location) || "Linh hoạt địa điểm"}</span>
                      <small>{pickFirstMeaningful(job.category?.name) || "Nhóm ngành đang được bổ sung thêm"}</small>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState description="Doanh nghiệp này có thể đang tuyển nội bộ hoặc chưa công khai vị trí mới. Bạn vẫn có thể lưu lại để quay lại sau." title="Hiện chưa có vị trí công khai" />
              )}
            </section>
          </article>
        </div>

        <aside className="portal-detail-sidebar">
          <article className="portal-side-card">
            <div className="portal-side-card__company">
              <CompanyLogo className="portal-side-card__logo" companyName={company.companyName} logoUrl={company.logoUrl} />
              <div className="stack stack--xs">
                <strong>{pickFirstMeaningful(company.companyName) || "Doanh nghiệp đang hoàn thiện hồ sơ"}</strong>
                <span>{getCompanyTrustLabel(company)}</span>
              </div>
            </div>
            <div className="portal-side-card__facts">
              <span>{getCompanyPresence(company)}</span>
              <span>{formatCompactNumber(openJobs)} vị trí đang mở</span>
            </div>
            <Link className="button button--primary" to="/register">
              Tạo tài khoản để theo dõi
            </Link>
          </article>

          <article className="portal-side-card">
            <div className="stack stack--xs">
              <strong>Dành cho ứng viên đang tìm hiểu doanh nghiệp</strong>
              <span>Lưu lại những công ty bạn thấy hợp về cách làm việc, nhịp tuyển dụng và định hướng nghề nghiệp để quay lại khi thời điểm phù hợp hơn.</span>
            </div>
            <Link className="button button--secondary" to="/jobs">
              Tiếp tục xem việc làm
            </Link>
          </article>
        </aside>
      </div>
    </section>
  );
}
