import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getEmployerJobs, updateJobStatus } from "@/api/employerApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";
import { formatCompactNumber, formatDate } from "@/utils/format";

function getEmployerJobAction(status) {
  if (status === "APPROVED") {
    return { nextStatus: "HIDDEN", label: "Ẩn tin" };
  }

  if (status === "HIDDEN" || status === "DRAFT" || status === "EXPIRED") {
    return { nextStatus: "PENDING", label: "Gửi duyệt lại" };
  }

  if (status === "PENDING") {
    return { nextStatus: "DRAFT", label: "Chuyển nháp" };
  }

  return { nextStatus: "PENDING", label: "Cập nhật trạng thái" };
}

export function EmployerJobsPage() {
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getEmployerJobs({ page, size: 10 });
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải danh sách tin tuyển dụng.",
            data: null,
          });
        }
      }
    }

    setState((current) => ({ ...current, loading: true }));
    load();
    return () => {
      ignore = true;
    };
  }, [page]);

  async function handleStatusChange(jobId, status) {
    try {
      await updateJobStatus(jobId, status);
      const data = await getEmployerJobs({ page, size: 10 });
      setState({ loading: false, error: "", data });
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái tin tuyển dụng.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro
        action={
          <Link className="button button--primary" to="/employer/jobs/create">
            Đăng tin mới
          </Link>
        }
        description="Bảng này bám đúng vòng đời job của backend: nháp, chờ duyệt, đã duyệt công khai, ẩn hoặc hết hạn."
        meta="Nhà tuyển dụng"
        title="Quản lý tin tuyển dụng"
      />

      {state.loading ? <SkeletonBlock lines={7} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((job) => {
                const action = getEmployerJobAction(job.status);

                return (
                  <div className="table-row employer-table-row employer-table-row--jobs" key={job.id}>
                    <div className="table-cell">
                      <strong>{job.title}</strong>
                      <span className="muted">{job.location || "Linh hoạt địa điểm"}</span>
                    </div>
                    <div className="table-cell">
                      <StatusBadge value={job.status} />
                      <span className="muted">Hạn {formatDate(job.deadline)}</span>
                    </div>
                    <div className="table-cell">
                      <span>{formatCompactNumber(job.applicationCount || 0)} hồ sơ</span>
                    </div>
                    <div className="table-actions">
                      <Link className="button button--secondary" to={`/employer/jobs/${job.id}/edit`}>
                        Sửa
                      </Link>
                      <button className="button button--ghost" onClick={() => handleStatusChange(job.id, action.nextStatus)} type="button">
                        {action.label}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState description="Tạo tin đầu tiên để bắt đầu luồng tuyển dụng và quản lý hồ sơ ứng viên." title="Chưa có tin tuyển dụng nào" />
        )
      ) : null}
    </div>
  );
}
