import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthProviders } from "@/api/authApi";
import { env } from "@/config/env";
import { useAuth } from "@/hooks/useAuth";
import { getGoogleOAuthErrorMessage, navigateByRole } from "@/utils/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [googleEnabled, setGoogleEnabled] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await login(form);
      navigateByRole(navigate, response.user?.role);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Đăng nhập chưa thành công. Bạn thử lại nhé.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const oauthError = searchParams.get("google_error");
    if (oauthError) {
      setGoogleError(getGoogleOAuthErrorMessage(oauthError));
    }

    let mounted = true;

    getAuthProviders()
      .then((providers) => {
        if (mounted) {
          setGoogleEnabled(Boolean(providers.googleEnabled));
        }
      })
      .catch(() => {
        if (mounted) {
          setGoogleEnabled(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleGoogleLogin() {
    setGoogleError("");
    setError("");
    const backendBaseUrl = env.apiUrl.replace(/\/api\/v1\/?$/, "");
    window.location.assign(`${backendBaseUrl}/oauth2/authorization/google`);
  }

  return (
    <section className="portal-auth portal-auth--joboko">
      <div className="portal-auth__inner">
        <div className="portal-auth__panel">
          <div className="portal-auth__header">
            <span className="portal-auth__eyebrow">Đăng nhập</span>
            <h1>Đăng nhập để ứng tuyển việc làm mong muốn.</h1>
          </div>

          {error ? (
            <div className="message-banner message-banner--error">{error}</div>
          ) : null}

          <form className="portal-auth__form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password">Mật khẩu</label>
              <input
                id="login-password"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Nhập mật khẩu của bạn"
                required
                type="password"
                value={form.password}
              />
            </div>

            <div className="portal-auth__form-meta">
              <span>
                Chỉ một lần đăng nhập để bạn quay lại đúng nơi mình cần và tiếp
                tục mọi thứ đang theo dõi.
              </span>
            </div>

            <div className="button-row">
              <button
                className="button button--primary"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Đang xử lý..." : "Đăng nhập"}
              </button>
              <Link className="button button--secondary" to="/register">
                Tạo tài khoản
              </Link>
            </div>
          </form>

          {googleEnabled ? (
            <>
              <div className="portal-auth__divider">
                <span>Hoặc tiếp tục với Google</span>
              </div>

              <div className="portal-auth__google">
                <button
                  className="button button--secondary"
                  onClick={handleGoogleLogin}
                  type="button"
                >
                  Tiếp tục với Google
                </button>
                <span className="portal-auth__google-note">
                  Bạn sẽ được chuyển sang Google để xác thực an toàn.
                </span>
                {googleError ? (
                  <div className="message-banner message-banner--error">
                    {googleError}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <aside className="portal-auth__aside">
          <div className="stack stack--sm">
            <strong>Đăng ký tài khoản để tận hưởng toàn bộ chức năng</strong>
            <p>
              Dù bạn đang tìm việc hay đang tuyển dụng, mọi thứ sẽ quay về đúng
              mạch làm việc quen thuộc chỉ sau một lần đăng nhập.
            </p>
          </div>

          <div className="portal-auth__mini-list">
            <div>
              <strong>Với ứng viên</strong>
              <span>
                Lưu việc làm, theo dõi đơn ứng tuyển để có thể tìm lại nhanh
                những cơ hội đang cân nhắc.
              </span>
            </div>
            <div>
              <strong>Với nhà tuyển dụng</strong>
              <span>
                Quản lý tin đăng, hồ sơ ứng viên và nhịp tuyển dụng trong một
                môi trường tối ưu hơn.
              </span>
            </div>
          </div>

          <Link className="button button--ghost" to="/register?role=EMPLOYER">
            Tạo tài khoản nhà tuyển dụng
          </Link>
        </aside>
      </div>
    </section>
  );
}
