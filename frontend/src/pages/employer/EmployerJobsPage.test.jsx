import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmployerJobsPage } from "@/pages/employer/EmployerJobsPage";
import { getEmployerJobs, updateJobStatus } from "@/api/employerApi";

vi.mock("@/api/employerApi", () => ({
  getEmployerJobs: vi.fn(),
  updateJobStatus: vi.fn(),
}));

vi.mock("@/components/ui", () => ({
  EmptyState: ({ title, description }) => (
    <div>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  ),
  ErrorState: ({ description }) => <div>{description}</div>,
  PageIntro: ({ title, action }) => (
    <div>
      <h1>{title}</h1>
      {action}
    </div>
  ),
  Pagination: () => <div>pagination</div>,
  SkeletonBlock: () => <div>loading jobs</div>,
  StatusBadge: ({ value }) => <span>{value}</span>,
}));

vi.mock("@/utils/format", async () => {
  const actual = await vi.importActual("@/utils/format");
  return {
    ...actual,
    formatCompactNumber: vi.fn((value) => String(value)),
    formatDate: vi.fn(() => "30/12/2026"),
  };
});

describe("EmployerJobsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads jobs and updates status", async () => {
    getEmployerJobs
      .mockResolvedValueOnce({
        page: 0,
        totalPages: 1,
        content: [
          {
            id: 10,
            title: "Backend Engineer",
            location: "Remote",
            status: "APPROVED",
            deadline: "2026-12-30",
            applicationCount: 3,
          },
        ],
      })
      .mockResolvedValueOnce({
        page: 0,
        totalPages: 1,
        content: [
          {
            id: 10,
            title: "Backend Engineer",
            location: "Remote",
            status: "HIDDEN",
            deadline: "2026-12-30",
            applicationCount: 3,
          },
        ],
      });
    updateJobStatus.mockResolvedValue({});

    render(
      <MemoryRouter>
        <EmployerJobsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Ẩn tin" }));

    await waitFor(() => {
      expect(updateJobStatus).toHaveBeenCalledWith(10, "HIDDEN");
    });

    expect(getEmployerJobs).toHaveBeenCalledWith({ page: 0, size: 10 });
    expect(getEmployerJobs).toHaveBeenCalledTimes(2);
  });

  it("shows error state when status update fails", async () => {
    getEmployerJobs.mockResolvedValue({
      page: 0,
      totalPages: 1,
      content: [
        {
          id: 11,
          title: "QA Engineer",
          location: "Remote",
          status: "APPROVED",
          deadline: "2026-12-30",
          applicationCount: 1,
        },
      ],
    });
    updateJobStatus.mockRejectedValue({
      response: { data: { message: "Update status failed" } },
    });

    render(
      <MemoryRouter>
        <EmployerJobsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("QA Engineer")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Ẩn tin" }));

    expect(await screen.findByText("Update status failed")).toBeInTheDocument();
  });
});
