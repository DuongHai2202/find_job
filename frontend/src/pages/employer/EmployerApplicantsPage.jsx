import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getEmployerApplications, updateApplicationStatus } from "@/api/employerApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/utils/format";

export function EmployerApplicantsPage() {
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
        const data = await getEmployerApplications({ page, size: 10 });
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải danh sách ứng viên.",
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

  async function handleStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, { status });
      const data = await getEmployerApplications({ page, size: 10 });
      setState({ loading: false, error: "", data });
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái ứng viên.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Danh sách này ưu tiên nhìn nhanh ứng viên, vị trí ứng tuyển và trạng thái xử lý gần nhất." meta="Nhà tuyển dụng" title="Ứng viên" />

      {state.loading ? <SkeletonBlock lines={7} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((application) => (
                <div className="table-row employer-table-row employer-table-row--applicants" key={application.id}>
                  <div className="table-cell">
                    <strong>{application.candidate?.fullName || application.candidateName || "Ứng viên đang cập nhật"}</strong>
                    <span className="muted">{application.job?.title || "Vị trí đang cập nhật"}</span>
                  </div>
                  <div className="table-cell">
                    <StatusBadge value={application.status} />
                    <span className="muted">{formatDateTime(application.updatedAt)}</span>
                  </div>
                  <div className="table-cell">
                    <span>{application.candidate?.email || application.email || "Chưa có email"}</span>
                  </div>
                  <div className="table-actions">
                    <Link className="button button--secondary" to={`/employer/applications/${application.id}`}>
                      Xem hồ sơ
                    </Link>
                    <button className="button button--ghost" onClick={() => handleStatus(application.id, "INTERVIEW")} type="button">
                      Mời phỏng vấn
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState description="Khi ứng viên nộp hồ sơ, danh sách xử lý sẽ xuất hiện tại đây." title="Chưa có ứng viên nào" />
        )
      ) : null}
    </div>
  );
}
