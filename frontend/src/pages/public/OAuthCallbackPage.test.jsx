import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthContext } from "@/context/AuthContext";
import {
  OAuthCallbackPage,
  parseOAuthFragment,
} from "@/pages/public/OAuthCallbackPage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("parseOAuthFragment", () => {
  it("parses a valid OAuth fragment", () => {
    const parsed = parseOAuthFragment(
      "#accessToken=token123&email=user%40mail.com&fullName=Demo+User&role=CANDIDATE&status=ACTIVE&userId=7",
    );

    expect(parsed).toEqual({
      accessToken: "token123",
      user: {
        id: 7,
        email: "user@mail.com",
        fullName: "Demo User",
        role: "CANDIDATE",
        status: "ACTIVE",
      },
    });
  });

  it("returns null for incomplete fragments", () => {
    expect(parseOAuthFragment("#accessToken=token123")).toBeNull();
  });
});

describe("OAuthCallbackPage", () => {
  it("completes OAuth session and redirects by role", async () => {
    window.history.replaceState(
      null,
      "",
      "/auth/callback#accessToken=token123&email=user%40mail.com&fullName=Demo+User&role=CANDIDATE&status=ACTIVE&userId=7",
    );

    const completeOAuthSession = vi.fn();

    render(
      <AuthContext.Provider value={{ completeOAuthSession }}>
        <MemoryRouter initialEntries={["/auth/callback"]}>
          <Routes>
            <Route element={<OAuthCallbackPage />} path="/auth/callback" />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      expect(completeOAuthSession).toHaveBeenCalledWith("token123", {
        id: 7,
        email: "user@mail.com",
        fullName: "Demo User",
        role: "CANDIDATE",
        status: "ACTIVE",
      });
    });

    expect(navigateMock).toHaveBeenCalledWith("/candidate", { replace: true });
  });

  it("shows an error when the fragment is invalid", () => {
    window.history.replaceState(null, "", "/auth/callback#bad=data");

    render(
      <AuthContext.Provider value={{ completeOAuthSession: vi.fn() }}>
        <MemoryRouter initialEntries={["/auth/callback"]}>
          <Routes>
            <Route element={<OAuthCallbackPage />} path="/auth/callback" />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(
      screen.getByText("Không nhận được phiên đăng nhập từ Google."),
    ).toBeInTheDocument();
  });
});
