import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext } from "@/context/AuthContext";
import { RegisterPage } from "@/pages/public/RegisterPage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderPage(authValue, initialEntry = "/register") {
  const view = render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<div>login page</div>} path="/login" />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

  return {
    ...view,
    companyInput: () => view.container.querySelector("#register-company-name"),
    fullNameInput: () => view.container.querySelector("#register-name"),
    phoneInput: () => view.container.querySelector("#register-phone"),
    emailInput: () => view.container.querySelector("#register-email"),
    passwordInput: () => view.container.querySelector("#register-password"),
    submitButton: () => view.container.querySelector("button[type='submit']"),
  };
}

describe("RegisterPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("prefills employer mode from query string", () => {
    const { companyInput } = renderPage({ register: vi.fn() }, "/register?role=EMPLOYER");

    expect(companyInput()).not.toBeNull();
  });

  it("submits candidate registration and redirects to candidate area", async () => {
    const register = vi.fn().mockResolvedValue({
      user: { role: "CANDIDATE" },
    });
    const view = renderPage({ register });

    fireEvent.change(view.fullNameInput(), { target: { value: "Demo Candidate" } });
    fireEvent.change(view.phoneInput(), { target: { value: "0987654321" } });
    fireEvent.change(view.emailInput(), { target: { value: "demo@jobportal.test" } });
    fireEvent.change(view.passwordInput(), { target: { value: "123456" } });
    fireEvent.click(view.submitButton());

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        email: "demo@jobportal.test",
        password: "123456",
        fullName: "Demo Candidate",
        phone: "0987654321",
        role: "CANDIDATE",
        companyName: "",
      });
    });

    expect(navigateMock).toHaveBeenCalledWith("/candidate");
  });

  it("submits employer registration and redirects to employer area", async () => {
    const register = vi.fn().mockResolvedValue({
      user: { role: "EMPLOYER" },
    });
    const view = renderPage({ register }, "/register?role=EMPLOYER");

    fireEvent.change(view.fullNameInput(), { target: { value: "Recruiter" } });
    fireEvent.change(view.phoneInput(), { target: { value: "0123456789" } });
    fireEvent.change(view.companyInput(), { target: { value: "FindJob Co" } });
    fireEvent.change(view.emailInput(), { target: { value: "employer@jobportal.test" } });
    fireEvent.change(view.passwordInput(), { target: { value: "123456" } });
    fireEvent.click(view.submitButton());

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        email: "employer@jobportal.test",
        password: "123456",
        fullName: "Recruiter",
        phone: "0123456789",
        role: "EMPLOYER",
        companyName: "FindJob Co",
      });
    });

    expect(navigateMock).toHaveBeenCalledWith("/employer");
  });
});
