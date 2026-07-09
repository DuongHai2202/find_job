import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmployerDashboardPage } from "@/pages/employer/EmployerDashboardPage";
import {
  getEmployerApplications,
  getEmployerJobs,
  getMyEmployerProfile,
} from "@/api/employerApi";

vi.mock("@/api/employerApi", () => ({
  getEmployerApplications: vi.fn(),
  getEmployerJobs: vi.fn(),
  getMyEmployerProfile: vi.fn(),
}));

vi.mock("@/components/ui", () => ({
  DataPanel: ({ title, children, action }) => (
    <section>
      <h2>{title}</h2>
      {action}
      {children}
    </section>
  ),
  EmptyState: ({ title, description }) => (
    <div>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  ),
  ErrorState: ({ description }) => <div>{description}</div>,
  PageIntro: ({ title }) => <h1>{title}</h1>,
  SkeletonBlock: ({ title }) => <div>{title}</div>,
  StatCard: ({ label, value }) => (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  ),
  StatusBadge: ({ value }) => <span>{value}</span>,
}));

vi.mock("@/content/siteCopy", () => ({
  getNaturalFallback: vi.fn(() => "fallback text"),
}));

describe("EmployerDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads employer dashboard data", async () => {
    getMyEmployerProfile.mockResolvedValue({
      companyName: "FindJob Co",
      companyDescription: "Hiring fast",
    });
    getEmployerJobs.mockResolvedValue({
      content: [{ id: 10, title: "Backend Dev", status: "APPROVED", applicationCount: 4 }],
    });
    getEmployerApplications.mockResolvedValue({
      totalElements: 1,
      content: [{ id: 7, status: "NEW", job: { title: "Backend Dev" }, candidate: { fullName: "Alice" } }],
    });

    render(
      <MemoryRouter>
        <EmployerDashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("FindJob Co")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Backend Dev")).toHaveLength(2);
    expect(getEmployerJobs).toHaveBeenCalledWith({ page: 0, size: 5 });
    expect(getEmployerApplications).toHaveBeenCalledWith({ page: 0, size: 6 });
  });

  it("shows error state when employer dashboard fails", async () => {
    getMyEmployerProfile.mockRejectedValue({
      response: { data: { message: "Employer dashboard failed" } },
    });

    render(
      <MemoryRouter>
        <EmployerDashboardPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Employer dashboard failed"),
    ).toBeInTheDocument();
  });
});
