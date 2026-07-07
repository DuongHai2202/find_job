import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

const initialForm = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  role: "CANDIDATE",
  companyName: "",
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = searchParams.get("role");

    if (role === "EMPLOYER" || role === "CANDIDATE") {
      setForm((current) => ({ ...current, role }));
    }
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await register(form);
      const role = response.user?.role;
      navigate(
        role === "EMPLOYER"
          ? "/employer"
          : role === "ADMIN"
            ? "/admin"
            : "/candidate",
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Đăng ký chưa thành công. Bạn thử lại nhé.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isEmployer = form.role === "EMPLOYER";

  return (
    <section className="portal-auth portal-auth--joboko">
      <div className="portal-auth__inner">
        <div className="portal-auth__panel">
          <div className="portal-auth__header">
            <span className="portal-auth__eyebrow">Tạo tài khoản</span>
            <h1>Đăng ký để bắt đầu tìm kiếm cơ hội nghệ nghiệp cho mình.</h1>
            <p>Good Luck.</p>
          </div>

          <div
            aria-label="Chọn vai trò"
            className="portal-role-switch"
            role="radiogroup"
          >
            <button
              aria-pressed={!isEmployer}
              className={`portal-role-switch__item${!isEmployer ? " portal-role-switch__item--active" : ""}`}
              onClick={() =>
                setForm((current) => ({ ...current, role: "CANDIDATE" }))
              }
              type="button"
            >
              <strong>Người tìm việc</strong>
              <span>
                Tạo hồ sơ, lưu việc làm và theo dõi đơn ứng tuyển theo cách nhẹ
                nhàng, dễ kiểm soát hơn.
              </span>
            </button>
            <button
              aria-pressed={isEmployer}
              className={`portal-role-switch__item${isEmployer ? " portal-role-switch__item--active" : ""}`}
              onClick={() =>
                setForm((current) => ({ ...current, role: "EMPLOYER" }))
              }
              type="button"
            >
              <strong>Nhà tuyển dụng</strong>
              <span>
                Tạo hồ sơ doanh nghiệp, đăng tin tuyển dụng và theo dõi ứng viên
                trong cùng một luồng làm việc.
              </span>
            </button>
          </div>

          {error ? (
            <div className="message-banner message-banner--error">{error}</div>
          ) : null}

          <form className="portal-auth__form" onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="register-name">
                  {isEmployer ? "Người đại diện" : "Họ và tên"}
                </label>
                <input
                  id="register-name"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder={isEmployer ? "Nhập họ và tên" : "Nhập họ và tên"}
                  required
                  value={form.fullName}
                />
              </div>
              <div className="field">
                <label htmlFor="register-phone">Số điện thoại</label>
                <input
                  id="register-phone"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                />
              </div>
            </div>

            {isEmployer ? (
              <div className="field">
                <label htmlFor="register-company-name">Tên công ty</label>
                <input
                  id="register-company-name"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      companyName: event.target.value,
                    }))
                  }
                  placeholder="Nhập tên công ty"
                  required
                  value={form.companyName}
                />
              </div>
            ) : null}

            <div className="grid-2">
              <div className="field">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Nhập email"
                  required
                  type="email"
                  value={form.email}
                />
              </div>
              <div className="field">
                <label htmlFor="register-password">Mật khẩu</label>
                <input
                  id="register-password"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  type="password"
                  value={form.password}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="register-role">Vai trò</label>
              <select
                id="register-role"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
                value={form.role}
              >
                <option value="CANDIDATE">Người tìm việc</option>
                <option value="EMPLOYER">Nhà tuyển dụng</option>
              </select>
            </div>

            <div className="portal-auth__form-meta">
              <span>
                {isEmployer
                  ? "Sau khi tạo tài khoản, bạn có thể bắt đầu hoàn thiện hồ sơ doanh nghiệp và chuẩn bị vị trí tuyển dụng đầu tiên."
                  : "Sau khi tạo tài khoản, bạn có thể bắt đầu làm hồ sơ, lưu việc làm và theo dõi hành trình ứng tuyển của mình."}
              </span>
            </div>

            <div className="button-row">
              <button
                className="button button--primary"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Đang xử lý..." : "Tạo tài khoản"}
              </button>
              <Link className="button button--secondary" to="/login">
                Đã có tài khoản
              </Link>
            </div>
          </form>
        </div>

        <aside className="portal-auth__aside">
          <strong>
            {isEmployer
              ? "Bạn đang bắt đầu ở vai trò nhà tuyển dụng"
              : "Bạn đang bắt đầu ở vai trò người tìm việc"}
          </strong>
          <p>
            {isEmployer
              ? "Một hồ sơ công ty rõ ràng và một tin tuyển dụng gọn gàng có thể giúp bạn đến gần hơn với đúng ứng viên mình đang cần."
              : "Một tài khoản rõ ràng ngay từ đầu sẽ giúp bạn lưu lại cơ hội tốt, theo dõi tiến trình ứng tuyển và chủ động hơn trong mỗi lần quyết định."}
          </p>

          <div className="portal-auth__mini-list">
            <div>
              <strong>
                {isEmployer ? "Quản lý tin đăng" : "Lưu việc làm"}
              </strong>
              <span>
                {isEmployer
                  ? "Theo dõi trạng thái vị trí, chỉnh sửa nội dung và giữ nhịp tuyển dụng gọn hơn."
                  : "Giữ lại những cơ hội đáng chú ý để quay lại khi bạn muốn cân nhắc kỹ hơn."}
              </span>
            </div>
            <div>
              <strong>
                {isEmployer ? "Theo dõi ứng viên" : "Theo dõi ứng tuyển"}
              </strong>
              <span>
                {isEmployer
                  ? "Xem hồ sơ mới và cập nhật trạng thái trong cùng một nơi."
                  : "Biết mình đang ở đâu trong hành trình tìm việc mà không cần nhớ quá nhiều thứ một lúc."}
              </span>
            </div>
          </div>

          <Link
            className="button button--ghost"
            to={isEmployer ? "/login" : "/register?role=EMPLOYER"}
          >
            {isEmployer
              ? "Đã có tài khoản nhà tuyển dụng"
              : "Chuyển sang nhà tuyển dụng"}
          </Link>
        </aside>
      </div>
    </section>
  );
}
