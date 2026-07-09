import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateApplicationsPage } from "@/pages/candidate/CandidateApplicationsPage";
import { getMyApplications } from "@/api/candidateApi";

vi.mock("@/api/candidateApi", () => ({
  getMyApplications: vi.fn(),
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
  SkeletonBlock: () => <div>loading applications</div>,
  StatusBadge: ({ value }) => <span>{value}</span>,
}));

vi.mock("@/utils/format", () => ({
  formatDateTime: vi.fn(() => "01/01/2026 10:00"),
}));

describe("CandidateApplicationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads candidate applications", async () => {
    getMyApplications.mockResolvedValue({
      page: 0,
      totalPages: 1,
      content: [
        {
          id: 1,
          status: "SUBMITTED",
          updatedAt: "2026-01-01T10:00:00Z",
          coverLetter: "I am interested",
          job: {
            title: "Frontend Engineer",
            location: "Remote",
            employer: { companyName: "FindJob Co" },
          },
        },
      ],
    });

    render(<CandidateApplicationsPage />);

    await waitFor(() => {
      expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    });

    expect(getMyApplications).toHaveBeenCalledWith({ page: 0, size: 8 });
    expect(screen.getByText("SUBMITTED")).toBeInTheDocument();
    expect(screen.getByText("I am interested")).toBeInTheDocument();
  });

  it("shows error state when loading applications fails", async () => {
    getMyApplications.mockRejectedValue({
      response: { data: { message: "Applications failed" } },
    });

    render(<CandidateApplicationsPage />);

    expect(await screen.findByText("Applications failed")).toBeInTheDocument();
  });
});
