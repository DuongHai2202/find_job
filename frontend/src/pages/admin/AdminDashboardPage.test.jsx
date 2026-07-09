import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { getPendingEmployers, getUsers, getJobsForReview } from "@/api/adminApi";
import { getCategories } from "@/api/categoryApi";

vi.mock("@/api/adminApi", () => ({
  getPendingEmployers: vi.fn(),
  getUsers: vi.fn(),
  getJobsForReview: vi.fn(),
}));

vi.mock("@/api/categoryApi", () => ({
  getCategories: vi.fn(),
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

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads admin dashboard data", async () => {
    getPendingEmployers.mockResolvedValue({
      totalElements: 1,
      content: [{ id: 3, companyName: "Pending Co", email: "pending@test.com", reviewStatus: "PENDING" }],
    });
    getJobsForReview.mockResolvedValue({
      totalElements: 1,
      content: [{ id: 4, title: "Review Me", employer: { companyName: "Pending Co" } }],
    });
    getUsers.mockResolvedValue({
      totalElements: 5,
      content: [],
    });
    getCategories.mockResolvedValue([{ id: 1, name: "IT" }]);

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Tổng quan vận hành")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Pending Co")).toHaveLength(2);
    expect(screen.getByText("Review Me")).toBeInTheDocument();
    expect(getPendingEmployers).toHaveBeenCalledWith({ page: 0, size: 5 });
    expect(getJobsForReview).toHaveBeenCalledWith({ page: 0, size: 5 });
    expect(getUsers).toHaveBeenCalledWith({ page: 0, size: 5 });
  });

  it("shows error state when admin dashboard fails", async () => {
    getPendingEmployers.mockRejectedValue({
      response: { data: { message: "Admin dashboard failed" } },
    });

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Admin dashboard failed"),
    ).toBeInTheDocument();
  });
});
