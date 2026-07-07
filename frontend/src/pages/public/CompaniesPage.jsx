import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPublicJobs } from "@/api/jobApi";
import { CompanyLogo } from "@/components/companyLogo";
import { Button, EmptyState, ErrorState, SkeletonBlock } from "@/components/ui";
import { getCompanyTagline, getCompanyTrustLabel, isMeaningfulValue, pickFirstMeaningful } from "@/content/siteCopy";
import { formatCompactNumber } from "@/utils/format";

export function CompaniesPage() {
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState({
    loading: true,
    error: "",
    companies: [],
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await getPublicJobs({ page: 0, size: 40, keyword: keyword || undefined });
        if (ignore) {
          return;
        }

        const companyMap = new Map();
        response.content.forEach((job) => {
          if (!job.employer?.id || !isMeaningfulValue(job.employer?.companyName)) {
            return;
          }

          const current = companyMap.get(job.employer.id);
          companyMap.set(job.employer.id, {
            userId: job.employer.id,
            companyName: job.employer.companyName,
            approved: job.employer.approved,
            logoUrl: pickFirstMeaningful(current?.logoUrl, job.employer?.logoUrl),
            companyDescription: pickFirstMeaningful(current?.companyDescription, job.employer?.companyDescription),
            website: pickFirstMeaningful(current?.website, job.employer?.website),
            address: pickFirstMeaningful(current?.address, job.employer?.address, job.location),
            openJobs: (current?.openJobs || 0) + 1,
          });
        });

        setState({
          loading: false,
          error: "",
          companies: Array.from(companyMap.values()).sort((left, right) => (right.openJobs || 0) - (left.openJobs || 0)),
        });
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Danh sách doanh nghiệp đang cần thêm một chút thời gian để sắp xếp lại.",
            companies: [],
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [keyword]);

  return (
    <>
      <section className="portal-page-hero portal-page-hero--light portal-page-hero--jobboard">
        <div className="portal-page-hero__inner">
          <div className="portal-page-hero__copy">
            <span className="portal-page-hero__eyebrow">Doanh nghiệp đang tuyển dụng</span>
            <h1>Chọn đúng nơi để theo dõi, rồi để cơ hội phù hợp tự đến gần bạn hơn.</h1>
            <p>Không chỉ là tên công ty, đây là nơi để bạn cảm nhận nhịp tuyển dụng, độ chỉn chu và mức độ phù hợp trước khi quyết định ứng tuyển.</p>
          </div>

          <div className="portal-filter-shell portal-filter-shell--compact">
            <div className="portal-filter-shell__grid portal-filter-shell__grid--companies">
              <input
                className="portal-search__control"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm công ty theo tên hoặc lĩnh vực..."
                value={keyword}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section portal-section">
        {state.loading ? (
          <div className="portal-company-list">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="panel" key={index}>
                <SkeletonBlock lines={4} title="Đang gom những doanh nghiệp đáng theo dõi..." />
              </div>
            ))}
          </div>
        ) : state.error ? (
          <ErrorState
            action={
              <Button onClick={() => window.location.reload()} variant="secondary">
                Tải lại
              </Button>
            }
            description={state.error}
          />
        ) : state.companies.length ? (
          <div className="stack">
            <div className="portal-results-bar portal-results-bar--rich">
              <div className="results-meta">
                <strong>{formatCompactNumber(state.companies.length)}</strong>
                <span>doanh nghiệp đang mở ra cơ hội để bạn tìm hiểu</span>
              </div>
            </div>

            <div className="portal-company-list">
              {state.companies.map((company) => (
                <Link className="portal-company-listing portal-company-listing--rich" key={company.userId} to={`/companies/${company.userId}`}>
                  <CompanyLogo className="portal-company-listing__logo" companyName={company.companyName} logoUrl={company.logoUrl} />
                  <div className="portal-company-listing__copy">
                    <strong>{company.companyName}</strong>
                    <p>{getCompanyTagline(company, company.openJobs || 0)}</p>
                    <span>{pickFirstMeaningful(company.address) || "Doanh nghiệp đang mở thêm cơ hội mới cho những ứng viên phù hợp"}</span>
                  </div>
                  <div className="portal-company-listing__meta">
                    <span>{getCompanyTrustLabel(company)}</span>
                    <strong>{formatCompactNumber(company.openJobs || 0)} việc làm</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            description="Khi có thêm vị trí được công khai và hồ sơ doanh nghiệp được làm đầy hơn, khu vực này sẽ mang đến cho bạn nhiều lựa chọn đáng cân nhắc hơn."
            title="Hiện chưa có doanh nghiệp phù hợp để hiển thị"
          />
        )}
      </section>
    </>
  );
}
