import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthContext } from "@/context/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

function renderWithAuth(authValue, initialEntry = "/candidate") {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["CANDIDATE"]} />}>
            <Route element={<div>candidate page</div>} path="/candidate" />
          </Route>
          <Route element={<div>login page</div>} path="/login" />
          <Route element={<div>home page</div>} path="/" />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects guest users to login", () => {
    renderWithAuth({
      isAuthenticated: false,
      ready: true,
      user: null,
    });

    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("renders child route for allowed role", () => {
    renderWithAuth({
      isAuthenticated: true,
      ready: true,
      user: { role: "CANDIDATE" },
    });

    expect(screen.getByText("candidate page")).toBeInTheDocument();
  });

  it("redirects authenticated users with wrong role to home", () => {
    renderWithAuth({
      isAuthenticated: true,
      ready: true,
      user: { role: "EMPLOYER" },
    });

    expect(screen.getByText("home page")).toBeInTheDocument();
  });

  it("renders nothing while auth is not ready", () => {
    const { container } = renderWithAuth({
      isAuthenticated: false,
      ready: false,
      user: null,
    });

    expect(container).toBeEmptyDOMElement();
  });
});
