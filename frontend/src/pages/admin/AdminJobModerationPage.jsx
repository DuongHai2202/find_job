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
    feedback: "",
    data: null,
  });

  async function load(targetPage = page) {
    const data = await getJobsForReview({ page: targetPage, size: 10 });
    setState((current) => ({
      ...current,
      loading: false,
      error: "",
      data,
    }));
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const data = await getJobsForReview({ page, size: 10 });
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: "",
            data,
          }));
        }
      } catch (error) {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.response?.data?.message || "Không thể tải hàng duyệt tin tuyển dụng.",
            data: null,
          }));
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
      setState((current) => ({
        ...current,
        feedback: status === "APPROVED" ? "Tin tuyển dụng đã được duyệt." : "Tin tuyển dụng đã được ẩn khỏi khu public.",
      }));
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
        meta="Quản trị"
        title="Duyệt tin tuyển dụng"
        description="Rà soát các tin đang chờ xuất hiện công khai để giữ chất lượng hiển thị và nhịp vận hành ổn định."
      />

      {state.loading ? <SkeletonBlock lines={7} title="Đang tải danh sách tin cần duyệt..." /> : null}
      {state.feedback ? <div className="message-banner">{state.feedback}</div> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((job) => (
                <div className="table-row admin-table-row admin-table-row--jobs" key={job.id}>
                  <div className="table-cell">
                    <strong>{job.title}</strong>
                    <span className="muted">{job.employer?.companyName || "Doanh nghiệp đang bổ sung hồ sơ"}</span>
                  </div>
                  <div className="table-cell">
                    <span>Hạn nộp {formatDate(job.deadline)}</span>
                    <span className="muted">{job.location || "Địa điểm đang cập nhật"}</span>
                  </div>
                  <div className="table-cell">
                    <StatusBadge value={job.status} />
                  </div>
                  <div className="table-actions">
                    <button className="button button--primary" onClick={() => handleStatus(job.id, "APPROVED")} type="button">
                      Duyệt
                    </button>
                    <button className="button button--danger" onClick={() => handleStatus(job.id, "HIDDEN")} type="button">
                      Ẩn
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState
            title="Không có tin đang chờ duyệt"
            description="Khu vực public hiện không có tin nào cần bạn xử lý thêm ở bước moderation."
          />
        )
      ) : null}
    </div>
  );
}
