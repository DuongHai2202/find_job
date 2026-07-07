import { Link, NavLink } from "react-router-dom";

import { formatCompactNumber, titleizeEnum } from "@/utils/format";

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div className="stack stack--tight">
        {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
        <div className="stack stack--xs">
          <h2 className="section-title">{title}</h2>
          {description ? <p className="section-description">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

export function PageIntro({ title, description, action, meta }) {
  return (
    <section className="page-intro">
      <div className="page-intro__content">
        <div className="stack stack--sm">
          {meta ? <span className="section-kicker">{meta}</span> : null}
          <div className="stack stack--xs">
            <h1 className="page-title">{title}</h1>
            {description ? <p className="page-intro__description">{description}</p> : null}
          </div>
        </div>
        {action ? <div className="page-intro__action">{action}</div> : null}
      </div>
    </section>
  );
}

export function DataPanel({ title, description, action, children, compact = false }) {
  return (
    <section className={`panel data-panel${compact ? " data-panel--compact" : ""}`}>
      {(title || description || action) && (
        <div className="data-panel__header">
          <div className="stack stack--xs">
            {title ? <h3 className="panel-title">{title}</h3> : null}
            {description ? <p className="panel-description">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      <div className="data-panel__body">{children}</div>
    </section>
  );
}

export function Button({ children, className = "", to, type = "button", variant = "primary", ...props }) {
  const classes = `button button--${variant}${className ? ` ${className}` : ""}`;

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}

export function StatCard({ label, value, hint, tone = "default" }) {
  return (
    <article className={`panel stat-card stat-card--${tone}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      {hint ? <p className="stat-card__hint">{hint}</p> : null}
    </article>
  );
}

export function StatusBadge({ value }) {
  const normalized = (value || "unknown").toString().toLowerCase();

  return <span className={`status-badge status-badge--${normalized}`}>{titleizeEnum(value)}</span>;
}

export function EmptyState({ title, description, action, tone = "gentle" }) {
  return (
    <section className={`empty-state empty-state--${tone}`}>
      <div className="stack stack--sm">
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}

export function ErrorState({
  title = "Mình chưa thể tải dữ liệu lúc này",
  description = "Bạn thử tải lại sau ít phút hoặc quay về bước trước để tiếp tục nhé.",
  action,
}) {
  return (
    <section className="error-state" role="alert">
      <div className="stack stack--sm">
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}

export function SkeletonBlock({ lines = 3, dense = false, title = "Đang chuẩn bị nội dung phù hợp cho bạn..." }) {
  return (
    <div className={`skeleton-block${dense ? " skeleton-block--dense" : ""}`}>
      <span className="skeleton-block__title">{title}</span>
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} className="skeleton-line" />
      ))}
    </div>
  );
}

export function FilterBar({ children }) {
  return <div className="filter-bar">{children}</div>;
}

export function FormField({ children, htmlFor, label, hint }) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {hint ? <small className="field__hint">{hint}</small> : null}
    </label>
  );
}

export function SearchInput({
  id = "search-input",
  label = "Tìm kiếm",
  value,
  onChange,
  placeholder = "Nhập vị trí, kỹ năng hoặc công ty bạn đang quan tâm",
}) {
  return (
    <label className="search-input" htmlFor={id}>
      <span className="search-input__label">{label}</span>
      <input id={id} onChange={onChange} placeholder={placeholder} type="search" value={value} />
    </label>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <Button disabled={page <= 0} onClick={() => onPageChange(page - 1)} variant="secondary">
        Trang trước
      </Button>
      <span className="pagination__meta">
        Trang {formatCompactNumber(page + 1)} / {formatCompactNumber(totalPages)}
      </span>
      <Button disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)} variant="secondary">
        Trang sau
      </Button>
    </div>
  );
}

export function AppNavLinks({ items }) {
  return (
    <nav aria-label="Điều hướng workspace" className="app-subnav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) => `app-subnav__link${isActive ? " app-subnav__link--active" : ""}`}
          end={item.end}
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
