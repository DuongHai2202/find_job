import { Link } from "react-router-dom";

import { CompanyLogo } from "@/components/companyLogo";
import { getCompanyPresence, getCompanyTagline, getCompanyTrustLabel, getJobLocationLabel } from "@/content/siteCopy";
import { StatusBadge } from "@/components/ui";
import { formatCurrencyRange, formatDate, titleizeEnum } from "@/utils/format";

export function JobCard({ job, actions, showStatus = false, compact = false }) {
  return (
    <article className={`job-card${compact ? " job-card--compact" : ""}`}>
      <div className="stack stack--xs">
        <div className="meta-row">
          {job.category?.name ? <span className="tag">{job.category.name}</span> : null}
          <span className="tag">{titleizeEnum(job.jobType)}</span>
          {showStatus && job.status ? <StatusBadge value={job.status} /> : null}
        </div>
        <div className="stack stack--xs">
          <h3 className="job-card__title">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="muted">
            {job.employer?.companyName || "Doanh nghiệp đang hoàn thiện hồ sơ"} • {getJobLocationLabel(job)}
          </p>
        </div>
      </div>
      <div className="job-card__meta">
        <span>{formatCurrencyRange(job.salaryMin, job.salaryMax)}</span>
        <span>Cấp độ {titleizeEnum(job.level)}</span>
        {job.deadline ? <span>Hạn {formatDate(job.deadline)}</span> : <span>Đang nhận hồ sơ phù hợp</span>}
      </div>
      {job.tags?.length ? (
        <div className="chip-row">
          {job.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="job-card__actions">
        {actions || (
          <>
            <Link className="button button--primary" to={`/jobs/${job.id}`}>
              Xem chi tiết
            </Link>
            <Link className="button button--secondary" to="/login">
              Lưu lại
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export function CompanyCard({ company, actions, openJobs = 0 }) {
  const companyId = company.userId || company.id || company.employerId;

  return (
    <article className="company-card">
      <div className="stack stack--xs">
        <div className="meta-row">
          <span className="tag">{getCompanyTrustLabel(company)}</span>
          {company.companySize ? <span className="tag">{company.companySize}</span> : null}
        </div>
        <div className="stack stack--xs">
          <CompanyLogo className="company-card__mark" companyName={company.companyName} logoUrl={company.logoUrl} />
          <h3 className="company-card__title">
            <Link to={`/companies/${companyId}`}>{company.companyName}</Link>
          </h3>
          <p className="muted">{getCompanyTagline(company, openJobs)}</p>
          <p className="company-card__subtle">{getCompanyPresence(company)}</p>
        </div>
      </div>
      <div className="job-card__actions">
        {actions || (
          <Link className="button button--secondary" to={`/companies/${companyId}`}>
            Xem công ty
          </Link>
        )}
      </div>
    </article>
  );
}
