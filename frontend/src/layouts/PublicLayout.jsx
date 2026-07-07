import { Link, Outlet } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui";

function FooterLink({ children, to }) {
  return (
    <Link className="site-footer__link" to={to}>
      {children}
    </Link>
  );
}

export function PublicLayout() {
  return (
    <div className="app-shell public-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <AppHeader />
      <main className="page-shell page-shell--public" id="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="stack stack--sm site-footer__brand">
            <strong className="site-footer__brand-name">FindJob</strong>
            <p className="site-footer__brand-copy">
              Đồng hành cùng người tìm việc trên hành trình chọn đúng cơ hội và giúp doanh nghiệp đến gần hơn với ứng viên phù hợp.
            </p>
            <div className="button-row">
              <Button to="/jobs" variant="secondary">
                Xem việc làm
              </Button>
              <Button to="/employers" variant="ghost">
                Dành cho nhà tuyển dụng
              </Button>
            </div>
          </div>

          <div className="site-footer__links">
            <div className="stack stack--xs">
              <strong>FindJob</strong>
              <FooterLink to="/">Trang chủ</FooterLink>
              <FooterLink to="/jobs">Việc làm</FooterLink>
              <FooterLink to="/companies">Công ty</FooterLink>
            </div>
            <div className="stack stack--xs">
              <strong>Về FindJob</strong>
              <FooterLink to="/companies">Doanh nghiệp</FooterLink>
              <FooterLink to="/jobs">Kinh nghiệm tìm việc</FooterLink>
              <FooterLink to="/employers">Giải pháp tuyển dụng</FooterLink>
            </div>
            <div className="stack stack--xs">
              <strong>Pháp lý</strong>
              <span>Điều khoản sử dụng</span>
              <span>Chính sách riêng tư</span>
              <span>Quy chế hoạt động</span>
            </div>
            <div className="stack stack--xs">
              <strong>Khách hàng</strong>
              <FooterLink to="/login">Hỗ trợ tài khoản</FooterLink>
              <FooterLink to="/employers">Dành cho nhà tuyển dụng</FooterLink>
              <FooterLink to="/register">Tạo tài khoản mới</FooterLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
