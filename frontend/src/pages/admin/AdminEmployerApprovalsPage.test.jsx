import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminEmployerApprovalsPage } from "@/pages/admin/AdminEmployerApprovalsPage";
import { getPendingEmployers, reviewEmployer } from "@/api/adminApi";

vi.mock("@/api/adminApi", () => ({
  getPendingEmployers: vi.fn(),
  reviewEmployer: vi.fn(),
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

describe("AdminEmployerApprovalsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads pending employers and approves one", async () => {
    getPendingEmployers
      .mockResolvedValueOnce({
        page: 0,
        totalPages: 1,
        content: [
          {
            id: 21,
            companyName: "Pending Co",
            email: "pending@test.com",
            companySize: "10-50",
            address: "Hanoi",
            reviewStatus: "PENDING",
          },
        ],
      })
      .mockResolvedValueOnce({
        page: 0,
        totalPages: 1,
        content: [],
      });
    reviewEmployer.mockResolvedValue({});

    render(
      <MemoryRouter>
        <AdminEmployerApprovalsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pending Co")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Duyệt" }));

    await waitFor(() => {
      expect(reviewEmployer).toHaveBeenCalledWith(21, "APPROVED");
    });

    expect(
      await screen.findByText("Nhà tuyển dụng đã được duyệt và kích hoạt."),
    ).toBeInTheDocument();
  });

  it("shows error state when employer review fails", async () => {
    getPendingEmployers.mockResolvedValue({
      page: 0,
      totalPages: 1,
      content: [
        {
          id: 22,
          companyName: "Pending Co",
          email: "pending@test.com",
          companySize: "10-50",
          address: "Hanoi",
          reviewStatus: "PENDING",
        },
      ],
    });
    reviewEmployer.mockRejectedValue({
      response: { data: { message: "Review employer failed" } },
    });

    render(
      <MemoryRouter>
        <AdminEmployerApprovalsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pending Co")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Duyệt" }));

    expect(
      await screen.findByText("Review employer failed"),
    ).toBeInTheDocument();
  });
});
