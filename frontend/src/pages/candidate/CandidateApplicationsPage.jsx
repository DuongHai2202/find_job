import { useEffect, useState } from "react";

import { getMyApplications } from "@/api/candidateApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/utils/format";

export function CandidateApplicationsPage() {
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
        const data = await getMyApplications({ page, size: 8 });
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải đơn ứng tuyển.",
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

  return (
    <div className="stack">
      <PageIntro description="Danh sách này ưu tiên trạng thái, thời điểm cập nhật gần nhất và khả năng đọc nhanh từng hồ sơ đã gửi." meta="Ứng viên" title="Đơn ứng tuyển của bạn" />
      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}
      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="timeline-list">
              {state.data.content.map((application) => (
                <div className="timeline-card" key={application.id}>
                  <div className="meta-row">
                    <StatusBadge value={application.status} />
                    <span className="muted">{formatDateTime(application.updatedAt)}</span>
                  </div>
                  <strong>{application.job?.title}</strong>
                  <p className="muted">
                    {application.job?.employer?.companyName || "Công ty đang cập nhật"} | {application.job?.location || "Linh hoạt địa điểm"}
                  </p>
                  {application.coverLetter ? <p>{application.coverLetter}</p> : null}
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState description="Sau khi ứng tuyển, toàn bộ tiến độ và cập nhật mới sẽ được theo dõi tại đây." title="Chưa có đơn ứng tuyển" />
        )
      ) : null}
    </div>
  );
}
