import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getGoogleAuthConfig } from "@/api/authApi";
import { env } from "@/config/env";
import { useAuth } from "@/hooks/useAuth";

const GOOGLE_SCRIPT_ID = "google-identity-service";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      if (window.google?.accounts?.id) {
        resolve(window.google);
        return;
      }

      existingScript.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Không tải được Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () =>
      reject(new Error("Không tải được Google Identity Services."));
    document.head.appendChild(script);
  });
}

function navigateByRole(navigate, role) {
  if (role === "CANDIDATE") {
    navigate("/candidate");
    return;
  }

  if (role === "EMPLOYER") {
    navigate("/employer");
    return;
  }

  if (role === "ADMIN") {
    navigate("/admin");
    return;
  }

  navigate("/");
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const googleButtonRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);

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
    let cancelled = false;

    async function setupGoogleLogin() {
      try {
        const clientId =
          env.googleClientId || (await getGoogleAuthConfig()).clientId;

        if (!clientId) {
          if (!cancelled) {
            setGoogleError(
              "Chưa cấu hình GOOGLE_CLIENT_ID cho đăng nhập Google.",
            );
          }
          return;
        }

        const googleInstance = await loadGoogleScript();
        if (
          cancelled ||
          !googleButtonRef.current ||
          !googleInstance?.accounts?.id
        ) {
          return;
        }

        googleInstance.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            if (!credential) {
              setGoogleError("Không nhận được mã xác thực từ Google.");
              return;
            }

            setGoogleSubmitting(true);
            setGoogleError("");
            setError("");

            try {
              const response = await loginWithGoogle(credential);
              navigateByRole(navigate, response.user?.role);
            } catch (requestError) {
              setGoogleError(
                requestError.response?.data?.message ||
                  "Đăng nhập Google chưa thành công.",
              );
            } finally {
              setGoogleSubmitting(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = "";
        googleInstance.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: "signin_with",
          width: 360,
        });

        if (!cancelled) {
          setGoogleReady(true);
          setGoogleError("");
        }
      } catch (setupError) {
        if (!cancelled) {
          setGoogleError(
            setupError.message || "Không khởi tạo được đăng nhập Google.",
          );
        }
      }
    }

    setupGoogleLogin();

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, navigate]);

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
                disabled={submitting || googleSubmitting}
                type="submit"
              >
                {submitting ? "Đang xử lý..." : "Đăng nhập"}
              </button>
              <Link className="button button--secondary" to="/register">
                Tạo tài khoản
              </Link>
            </div>
          </form>

          <div className="portal-auth__divider">
            <span>Hoặc tiếp tục với Google</span>
          </div>

          <div className="portal-auth__google">
            <div
              aria-busy={googleSubmitting}
              className={`portal-auth__google-slot${googleReady ? " portal-auth__google-slot--ready" : ""}`}
              ref={googleButtonRef}
            />
            {googleSubmitting ? (
              <span className="portal-auth__google-note">
                Đang xác thực tài khoản Google...
              </span>
            ) : null}
            {googleError ? (
              <div className="message-banner message-banner--error">
                {googleError}
              </div>
            ) : null}
          </div>
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
