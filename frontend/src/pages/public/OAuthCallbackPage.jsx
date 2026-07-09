import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { navigateByRole } from "@/utils/auth";

export function parseOAuthFragment(hash) {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const accessToken = params.get("accessToken");
  const email = params.get("email");
  const fullName = params.get("fullName");
  const role = params.get("role");
  const status = params.get("status");
  const userId = params.get("userId");

  if (!accessToken || !email || !role || !status || !userId) {
    return null;
  }

  return {
    accessToken,
    user: {
      id: Number(userId),
      email,
      fullName: fullName ?? "Tài khoản Google",
      role,
      status,
    },
  };
}

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthSession } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const session = parseOAuthFragment(window.location.hash);
    if (!session) {
      setError("Không nhận được phiên đăng nhập từ Google.");
      return;
    }

    completeOAuthSession(session.accessToken, session.user);
    window.history.replaceState(null, document.title, window.location.pathname);
    navigateByRole(navigate, session.user.role);
  }, [completeOAuthSession, navigate]);

  return (
    <section className="portal-auth portal-auth--joboko">
      <div className="portal-auth__inner">
        <div className="portal-auth__panel">
          <div className="portal-auth__header">
            <span className="portal-auth__eyebrow">Google OAuth2</span>
            <h1>Đang hoàn tất đăng nhập...</h1>
          </div>

          {error ? (
            <div className="message-banner message-banner--error">{error}</div>
          ) : (
            <div className="portal-auth__form-meta">
              <span>Hệ thống đang đồng bộ phiên đăng nhập của bạn.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
