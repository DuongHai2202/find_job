import { useEffect, useState } from "react";

import { getPendingEmployers, reviewEmployer } from "@/api/adminApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";

export function AdminEmployerApprovalsPage() {
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  async function load(targetPage = page) {
    const data = await getPendingEmployers({ page: targetPage, size: 10 });
    setState({ loading: false, error: "", data });
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const data = await getPendingEmployers({ page, size: 10 });
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải hàng duyệt nhà tuyển dụng.",
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

  async function handleReview(employerUserId, approved) {
    try {
      await reviewEmployer(employerUserId, approved);
      await load();
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật quyết định duyệt doanh nghiệp.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Danh sách này tập trung vào những doanh nghiệp cần được duyệt trước khi tham gia luồng tuyển dụng chính thức." meta="Quản trị" title="Duyệt nhà tuyển dụng" />

      {state.loading ? <SkeletonBlock lines={7} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((employer) => (
                <div className="table-row admin-table-row admin-table-row--approvals" key={employer.id}>
                  <div className="table-cell">
                    <strong>{employer.companyName || employer.fullName || "Doanh nghiệp đang cập nhật"}</strong>
                    <span className="muted">{employer.email || "Chưa có email"}</span>
                  </div>
                  <div className="table-cell">
                    <span>{employer.website || "Chưa có website"}</span>
                  </div>
                  <div className="table-cell">
                    <StatusBadge value={employer.approved ? "APPROVED" : "PENDING"} />
                  </div>
                  <div className="table-actions">
                    <button className="button button--primary" onClick={() => handleReview(employer.id, true)} type="button">
                      Duyệt
                    </button>
                    <button className="button button--danger" onClick={() => handleReview(employer.id, false)} type="button">
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState description="Không còn doanh nghiệp nào trong hàng chờ hiện tại." title="Hàng duyệt đang trống" />
        )
      ) : null}
    </div>
  );
}
