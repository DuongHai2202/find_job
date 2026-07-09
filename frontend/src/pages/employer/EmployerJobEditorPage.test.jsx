import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmployerJobEditorPage } from "@/pages/employer/EmployerJobEditorPage";
import { getCategories } from "@/api/categoryApi";
import { createJob, getEmployerJobs, updateJob, updateJobStatus } from "@/api/employerApi";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/api/categoryApi", () => ({
  getCategories: vi.fn(),
}));

vi.mock("@/api/employerApi", () => ({
  createJob: vi.fn(),
  getEmployerJobs: vi.fn(),
  updateJob: vi.fn(),
  updateJobStatus: vi.fn(),
}));

vi.mock("@/components/ui", () => ({
  ErrorState: ({ description }) => <div>{description}</div>,
  PageIntro: ({ title, action }) => (
    <div>
      <h1>{title}</h1>
      {action}
    </div>
  ),
  SkeletonBlock: () => <div>loading editor</div>,
}));

function renderCreatePage() {
  return render(
    <MemoryRouter initialEntries={["/employer/jobs/create"]}>
      <Routes>
        <Route element={<EmployerJobEditorPage mode="create" />} path="/employer/jobs/create" />
      </Routes>
    </MemoryRouter>,
  );
}

function renderEditPage() {
  return render(
    <MemoryRouter initialEntries={["/employer/jobs/12/edit"]}>
      <Routes>
        <Route element={<EmployerJobEditorPage mode="edit" />} path="/employer/jobs/:jobId/edit" />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EmployerJobEditorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();
    getCategories.mockResolvedValue([{ id: 1, name: "IT" }]);
  });

  it("creates a new job and redirects to jobs page", async () => {
    createJob.mockResolvedValue({ id: 99, status: "DRAFT" });
    updateJobStatus.mockResolvedValue({});

    renderCreatePage();

    fireEvent.change(screen.getByLabelText("Tiêu đề"), { target: { value: "New Job" } });
    fireEvent.change(screen.getByLabelText("Địa điểm"), { target: { value: "Remote" } });
    fireEvent.change(document.querySelector("#job-category"), { target: { value: "1" } });
    fireEvent.change(document.querySelector("#job-status"), { target: { value: "PENDING" } });
    fireEvent.click(screen.getByRole("button", { name: "Tạo tin tuyển dụng" }));

    await waitFor(() => {
      expect(createJob).toHaveBeenCalledTimes(1);
    });

    expect(createJob).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Job",
        location: "Remote",
        jobType: "FULLTIME",
        level: "JUNIOR",
      }),
    );
    expect(updateJobStatus).toHaveBeenCalledWith(99, "PENDING");
    expect(navigateMock).toHaveBeenCalledWith("/employer/jobs");
  });

  it("loads an existing job and saves updates", async () => {
    getEmployerJobs.mockResolvedValue({
      content: [
        {
          id: 12,
          title: "Existing Job",
          location: "Hanoi",
          salaryMin: 1000,
          salaryMax: 2000,
          jobType: "FULLTIME",
          level: "JUNIOR",
          category: { id: 1 },
          deadline: "2026-12-30",
          description: "Desc",
          requirements: "Req",
          benefits: "Benefit",
          status: "DRAFT",
        },
      ],
    });
    updateJob.mockResolvedValue({ id: 12, status: "DRAFT" });
    updateJobStatus.mockResolvedValue({});

    renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Existing Job")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Tiêu đề"), { target: { value: "Updated Job" } });
    fireEvent.change(screen.getByLabelText("Trạng thái"), { target: { value: "PENDING" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu cập nhật" }));

    await waitFor(() => {
      expect(updateJob).toHaveBeenCalledWith("12", {
        title: "Updated Job",
        location: "Hanoi",
        salaryMin: 1000,
        salaryMax: 2000,
        jobType: "FULLTIME",
        level: "JUNIOR",
        categoryId: 1,
        deadline: "2026-12-30",
        description: "Desc",
        requirements: "Req",
        benefits: "Benefit",
      });
    });

    expect(updateJobStatus).toHaveBeenCalledWith("12", "PENDING");
    expect(await screen.findByText("Đã cập nhật tin tuyển dụng.")).toBeInTheDocument();
  });
});
