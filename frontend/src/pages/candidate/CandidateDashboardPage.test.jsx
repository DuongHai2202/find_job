import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateDashboardPage } from "@/pages/candidate/CandidateDashboardPage";
import {
  getMyApplications,
  getMyCandidateProfile,
  getMyResumes,
  getSavedJobs,
} from "@/api/candidateApi";
import { getUnreadNotificationCount } from "@/api/notificationApi";
import { getMyRecommendations } from "@/api/jobApi";

vi.mock("@/api/candidateApi", () => ({
  getMyApplications: vi.fn(),
  getMyCandidateProfile: vi.fn(),
  getMyResumes: vi.fn(),
  getSavedJobs: vi.fn(),
}));

vi.mock("@/api/notificationApi", () => ({
  getUnreadNotificationCount: vi.fn(),
}));

vi.mock("@/api/jobApi", () => ({
  getMyRecommendations: vi.fn(),
}));

vi.mock("@/components/domain", () => ({
  JobCard: ({ job }) => <div>{job.title}</div>,
}));

vi.mock("@/components/ui", () => ({
  DataPanel: ({ title, children }) => (
    <section>
      <h2>{title}</h2>
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
}));

vi.mock("@/content/siteCopy", () => ({
  getNaturalFallback: vi.fn(() => "fallback text"),
}));

describe("CandidateDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and renders candidate dashboard data", async () => {
    getMyCandidateProfile.mockResolvedValue({
      fullName: "Demo Candidate",
      headline: "Frontend Developer",
      summary: "summary",
      address: "Hanoi",
    });
    getMyResumes.mockResolvedValue([{ id: 1 }]);
    getMyApplications.mockResolvedValue({
      totalElements: 1,
      content: [{ id: 1, status: "SUBMITTED", job: { title: "Frontend Dev" } }],
    });
    getMyRecommendations.mockResolvedValue({
      content: [{ id: 99, title: "Recommended Job" }],
    });
    getSavedJobs.mockResolvedValue({
      content: [{ id: 5, job: { title: "Saved Job", location: "Remote" } }],
    });
    getUnreadNotificationCount.mockResolvedValue(3);

    render(<CandidateDashboardPage />);

    expect(
      screen.getByText(/Đang chuẩn bị không gian ứng tuyển của bạn/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Demo Candidate/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Recommended Job")).toBeInTheDocument();
    expect(getMyApplications).toHaveBeenCalledWith({ page: 0, size: 5 });
    expect(getMyRecommendations).toHaveBeenCalledWith({ page: 0, size: 4 });
    expect(getSavedJobs).toHaveBeenCalledWith({ page: 0, size: 4 });
  });

  it("shows an error state when loading fails", async () => {
    getMyCandidateProfile.mockRejectedValue({
      response: { data: { message: "Candidate dashboard failed" } },
    });

    render(<CandidateDashboardPage />);

    expect(
      await screen.findByText("Candidate dashboard failed"),
    ).toBeInTheDocument();
  });
});
