import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminJobModerationPage } from "@/pages/admin/AdminJobModerationPage";
import { getJobsForReview } from "@/api/adminApi";
import { updateJobStatus } from "@/api/employerApi";

vi.mock("@/api/adminApi", () => ({
  getJobsForReview: vi.fn(),
}));

vi.mock("@/api/employerApi", () => ({
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
  PageIntro: ({ title }) => <h1>{title}</h1>,
  Pagination: () => <div>pagination</div>,
  SkeletonBlock: ({ title }) => <div>{title}</div>,
  StatusBadge: ({ value }) => <span>{value}</span>,
}));

vi.mock("@/utils/format", () => ({
  formatDate: vi.fn(() => "30/12/2026"),
}));

describe("AdminJobModerationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads jobs for review and approves a job", async () => {
    getJobsForReview
      .mockResolvedValueOnce({
        page: 0,
        totalPages: 1,
        content: [{ id: 31, title: "Moderate Me", deadline: "2026-12-30", location: "Remote", status: "PENDING", employer: { companyName: "FindJob Co" } }],
      })
      .mockResolvedValueOnce({
        page: 0,
        totalPages: 1,
        content: [],
      });
    updateJobStatus.mockResolvedValue({});

    render(
      <MemoryRouter>
        <AdminJobModerationPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Moderate Me")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Duyệt" }));

    await waitFor(() => {
      expect(updateJobStatus).toHaveBeenCalledWith(31, "APPROVED");
    });

    expect(await screen.findByText("Tin tuyển dụng đã được duyệt.")).toBeInTheDocument();
  });

  it("shows error when job moderation fails", async () => {
    getJobsForReview.mockResolvedValue({
      page: 0,
      totalPages: 1,
      content: [{ id: 32, title: "Hidden Job", deadline: "2026-12-30", location: "Remote", status: "PENDING", employer: { companyName: "FindJob Co" } }],
    });
    updateJobStatus.mockRejectedValue({
      response: { data: { message: "Moderation failed" } },
    });

    render(
      <MemoryRouter>
        <AdminJobModerationPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hidden Job")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Ẩn" }));

    expect(await screen.findByText("Moderation failed")).toBeInTheDocument();
  });
});
