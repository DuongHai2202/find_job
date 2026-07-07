import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="section">
      <div className="portal-not-found">
        <span className="portal-not-found__code">404</span>
        <h1 className="page-title">Không tìm thấy trang</h1>
        <p className="muted">Đường dẫn này không còn tồn tại hoặc chưa được mở trong phiên bản hiện tại của hệ thống.</p>
        <div className="button-row">
          <Link className="button button--primary" to="/">
            Quay về trang chủ
          </Link>
          <Link className="button button--secondary" to="/jobs">
            Xem việc làm
          </Link>
        </div>
      </div>
    </main>
  );
}
