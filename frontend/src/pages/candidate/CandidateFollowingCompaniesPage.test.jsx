import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateFollowingCompaniesPage } from "@/pages/candidate/CandidateFollowingCompaniesPage";
import { getFollowingCompanies, unfollowCompany } from "@/api/candidateApi";

vi.mock("@/api/candidateApi", () => ({
  getFollowingCompanies: vi.fn(),
  unfollowCompany: vi.fn(),
}));

vi.mock("@/components/domain", () => ({
  CompanyCard: ({ company, actions }) => (
    <div>
      <strong>{company.companyName}</strong>
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
  SkeletonBlock: () => <div>loading following companies</div>,
}));

describe("CandidateFollowingCompaniesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads followed companies and unfollows one", async () => {
    getFollowingCompanies
      .mockResolvedValueOnce({
        content: [{ id: 1, employerId: 15, companyName: "Followed Co" }],
      })
      .mockResolvedValueOnce({
        content: [],
      });
    unfollowCompany.mockResolvedValue(undefined);

    render(<CandidateFollowingCompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText("Followed Co")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Bỏ theo dõi" }));

    await waitFor(() => {
      expect(unfollowCompany).toHaveBeenCalledWith(15);
    });

    expect(getFollowingCompanies).toHaveBeenCalledWith({ page: 0, size: 20 });
    expect(getFollowingCompanies).toHaveBeenCalledTimes(2);
  });

  it("shows error when unfollow fails", async () => {
    getFollowingCompanies.mockResolvedValue({
      content: [{ id: 2, employerId: 20, companyName: "Tracked Co" }],
    });
    unfollowCompany.mockRejectedValue({
      response: { data: { message: "Unfollow failed" } },
    });

    render(<CandidateFollowingCompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText("Tracked Co")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Bỏ theo dõi" }));

    expect(await screen.findByText("Unfollow failed")).toBeInTheDocument();
  });
});
