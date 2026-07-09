import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authApi from "@/api/authApi";
import { AuthContext } from "@/context/AuthContext";
import { LoginPage } from "@/pages/public/LoginPage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/api/authApi", async () => {
  const actual = await vi.importActual("@/api/authApi");
  return {
    ...actual,
    getAuthProviders: vi.fn(),
  };
});

function renderPage(authValue, initialEntry = "/login") {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<div>register page</div>} path="/register" />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(authApi.getAuthProviders).mockResolvedValue({ googleEnabled: true });
    window.history.replaceState(null, "", "/login");
  });

  it("submits credentials and redirects candidate users", async () => {
    const login = vi.fn().mockResolvedValue({
      user: { role: "CANDIDATE" },
    });

    renderPage({ login });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "candidate@jobportal.test" },
    });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "candidate@jobportal.test",
        password: "123456",
      });
    });

    expect(navigateMock).toHaveBeenCalledWith("/candidate", { replace: true });
  });

  it("shows request error when login fails", async () => {
    const login = vi.fn().mockRejectedValue({
      response: {
        data: {
          message: "Sai mat khau",
        },
      },
    });

    renderPage({ login });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "candidate@jobportal.test" },
    });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), {
      target: { value: "bad-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(await screen.findByText("Sai mat khau")).toBeInTheDocument();
  });

  it("shows google oauth failure returned on the login URL", async () => {
    window.history.replaceState(null, "", "/login?google_error=google_role_not_allowed");
    renderPage({ login: vi.fn() }, "/login?google_error=google_role_not_allowed");

    expect(
      await screen.findByText("Đăng nhập Google hiện chỉ hỗ trợ tài khoản ứng viên."),
    ).toBeInTheDocument();
  });

  it("hides google login when backend reports provider unavailable", async () => {
    vi.mocked(authApi.getAuthProviders).mockResolvedValue({ googleEnabled: false });

    renderPage({ login: vi.fn() });

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Tiếp tục với Google" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Hoặc tiếp tục với Google")).not.toBeInTheDocument();
  });
});
