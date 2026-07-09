import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateSavedJobsPage } from "@/pages/candidate/CandidateSavedJobsPage";
import { getSavedJobs, removeSavedJob } from "@/api/candidateApi";

vi.mock("@/api/candidateApi", () => ({
  getSavedJobs: vi.fn(),
  removeSavedJob: vi.fn(),
}));

vi.mock("@/components/domain", () => ({
  JobCard: ({ job, actions }) => (
    <div>
      <strong>{job.title}</strong>
      {actions}
    </div>
  ),
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
  SkeletonBlock: () => <div>loading saved jobs</div>,
}));

describe("CandidateSavedJobsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and removes a saved job", async () => {
    getSavedJobs
      .mockResolvedValueOnce({
        content: [{ id: 2, job: { id: 10, title: "Saved Frontend Job" } }],
      })
      .mockResolvedValueOnce({
        content: [],
      });
    removeSavedJob.mockResolvedValue(undefined);

    render(<CandidateSavedJobsPage />);

    await waitFor(() => {
      expect(screen.getByText("Saved Frontend Job")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Bỏ lưu" }));

    await waitFor(() => {
      expect(removeSavedJob).toHaveBeenCalledWith(10);
    });

    expect(getSavedJobs).toHaveBeenCalledWith({ page: 0, size: 12 });
    expect(getSavedJobs).toHaveBeenCalledTimes(2);
  });

  it("shows error when remove saved job fails", async () => {
    getSavedJobs.mockResolvedValue({
      content: [{ id: 3, job: { id: 11, title: "Saved QA Job" } }],
    });
    removeSavedJob.mockRejectedValue({
      response: { data: { message: "Remove saved job failed" } },
    });

    render(<CandidateSavedJobsPage />);

    await waitFor(() => {
      expect(screen.getByText("Saved QA Job")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Bỏ lưu" }));

    expect(await screen.findByText("Remove saved job failed")).toBeInTheDocument();
  });
});
