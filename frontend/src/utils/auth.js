export function navigateByRole(navigate, role) {
  if (role === "CANDIDATE") {
    navigate("/candidate", { replace: true });
    return;
  }

  if (role === "EMPLOYER") {
    navigate("/employer", { replace: true });
    return;
  }

  if (role === "ADMIN") {
    navigate("/admin", { replace: true });
    return;
  }

  navigate("/", { replace: true });
}

const GOOGLE_OAUTH_ERROR_MESSAGES = {
  google_not_configured:
    "Đăng nhập Google chưa được cấu hình trên môi trường này.",
  google_oauth_failed:
    "Đăng nhập Google chưa thành công. Bạn thử lại nhé.",
  google_invalid_principal:
    "Không đọc được thông tin tài khoản Google. Bạn thử lại nhé.",
  google_account_incomplete:
    "Tài khoản Google không trả về đủ thông tin bắt buộc.",
  google_email_unverified:
    "Tài khoản Google của bạn chưa xác minh email.",
  google_role_not_allowed:
    "Đăng nhập Google hiện chỉ hỗ trợ tài khoản ứng viên.",
  google_account_not_active:
    "Tài khoản của bạn không ở trạng thái hoạt động.",
};

export function getGoogleOAuthErrorMessage(code) {
  if (!code) {
    return "";
  }

  return (
    GOOGLE_OAUTH_ERROR_MESSAGES[code] ||
    "Đăng nhập Google chưa thành công. Bạn thử lại nhé."
  );
}
