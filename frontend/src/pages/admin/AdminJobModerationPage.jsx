import { useEffect, useState } from "react";

import { getJobsForReview } from "@/api/adminApi";
import { updateJobStatus } from "@/api/employerApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";
import { formatDate } from "@/utils/format";

export function AdminJobModerationPage() {
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  async function load(targetPage = page) {
    const data = await getJobsForReview({ page: targetPage, size: 10 });
    setState({ loading: false, error: "", data });
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const data = await getJobsForReview({ page, size: 10 });
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải hàng duyệt tin tuyển dụng.",
            data: null,
          });
        }
      }
    }

    setState((current) => ({ ...current, loading: true }));
    run();
    return () => {
      ignore = true;
    };
  }, [page]);

  async function handleStatus(jobId, status) {
    try {
      await updateJobStatus(jobId, status);
      await load();
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái kiểm duyệt tin.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Bảng duyệt này ưu tiên quét nhanh tiêu đề, doanh nghiệp, hạn nộp và trạng thái hiển thị của từng tin tuyển dụng." meta="Quản trị" title="Duyệt tin tuyển dụng" />

      {state.loading ? <SkeletonBlock lines={7} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((job) => (
                <div className="table-row admin-table-row admin-table-row--jobs" key={job.id}>
                  <div className="table-cell">
                    <strong>{job.title}</strong>
                    <span className="muted">{job.employer?.companyName || "Công ty đang cập nhật"}</span>
                  </div>
                  <div className="table-cell">
                    <span>Hạn {formatDate(job.deadline)}</span>
                  </div>
                  <div className="table-cell">
                    <StatusBadge value={job.status} />
                  </div>
                  <div className="table-actions">
                    <button className="button button--primary" onClick={() => handleStatus(job.id, "APPROVED")} type="button">
                      Duyệt
                    </button>
                    <button className="button button--danger" onClick={() => handleStatus(job.id, "HIDDEN")} type="button">
                      Ẩn tin
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState description="Hiện không có tin tuyển dụng nào đang chờ kiểm duyệt." title="Không có tin chờ duyệt" />
        )
      ) : null}
    </div>
  );
}
