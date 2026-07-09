import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JobDetailPage } from "@/pages/public/JobDetailPage";
import { getJobById, getPublicJobs } from "@/api/jobApi";

vi.mock("@/api/jobApi", () => ({
  getJobById: vi.fn(),
  getPublicJobs: vi.fn(),
}));

vi.mock("@/components/companyLogo", () => ({
  CompanyLogo: ({ companyName }) => <div>{companyName}</div>,
}));

vi.mock("@/components/ui", () => ({
  EmptyState: ({ title, description }) => (
    <div>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  ),
  ErrorState: ({ description }) => <div>{description}</div>,
  SkeletonBlock: ({ title }) => <div>{title}</div>,
  StatusBadge: ({ value }) => <span>{value}</span>,
}));

vi.mock("@/content/siteCopy", () => ({
  getCompanyTagline: vi.fn(() => "Great culture"),
  getCompanyTrustLabel: vi.fn(() => "Trusted employer"),
  getJobDeadlineLine: vi.fn(() => "Deadline line"),
  getJobReasonToCare: vi.fn(() => "Reason to care"),
  getNaturalFallback: vi.fn(() => "fallback"),
  isMeaningfulValue: vi.fn((value) => Boolean(value)),
  pickFirstMeaningful: vi.fn((...values) => values.find(Boolean) ?? null),
}));

describe("JobDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads job detail and related jobs with login CTAs", async () => {
    getJobById.mockResolvedValue({
      id: 1,
      title: "Frontend Engineer",
      description: "Build UI",
      requirements: "React",
      benefits: "Remote",
      salaryMin: 1000,
      salaryMax: 2000,
      location: "Ho Chi Minh City",
      jobType: "FULL_TIME",
      level: "MID",
      status: "APPROVED",
      deadline: "2026-12-30",
      category: { id: 8, name: "IT" },
      employer: { id: 2, companyName: "FindJob Co", logoUrl: null },
    });
    getPublicJobs.mockResolvedValue({
      content: [
        { id: 1, title: "Frontend Engineer" },
        { id: 3, title: "Related Job", employer: { companyName: "Another Co" }, salaryMin: 1200, salaryMax: 1800 },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/jobs/1"]}>
        <Routes>
          <Route element={<JobDetailPage />} path="/jobs/:jobId" />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    });

    expect(getPublicJobs).toHaveBeenCalledWith({
      categoryId: 8,
      location: "Ho Chi Minh City",
      page: 0,
      size: 4,
    });

    expect(screen.getByRole("link", { name: "Ứng tuyển ngay" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Lưu việc làm" })).toHaveAttribute("href", "/login");
    expect(screen.getByText("Related Job")).toBeInTheDocument();
  });

  it("shows error state when job detail fails", async () => {
    getJobById.mockRejectedValue({
      response: { data: { message: "Job detail failed" } },
    });

    render(
      <MemoryRouter initialEntries={["/jobs/1"]}>
        <Routes>
          <Route element={<JobDetailPage />} path="/jobs/:jobId" />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Job detail failed")).toBeInTheDocument();
  });
});
