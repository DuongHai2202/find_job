import { useEffect, useState } from "react";

import { getPendingEmployers, reviewEmployer } from "@/api/adminApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";

export function AdminEmployerApprovalsPage() {
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    feedback: "",
    data: null,
  });

  async function load(targetPage = page) {
    const data = await getPendingEmployers({ page: targetPage, size: 10 });
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
        const data = await getPendingEmployers({ page, size: 10 });
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
            error: error.response?.data?.message || "Không thể tải hàng chờ duyệt nhà tuyển dụng.",
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

  async function handleReview(employerUserId, status) {
    try {
      await reviewEmployer(employerUserId, status);
      await load();
      setState((current) => ({
        ...current,
        feedback:
          status === "APPROVED"
            ? "Nhà tuyển dụng đã được duyệt và kích hoạt."
            : "Nhà tuyển dụng đã được chuyển sang trạng thái từ chối.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái duyệt nhà tuyển dụng.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro
        meta="Quản trị"
        title="Duyệt nhà tuyển dụng"
        description="Xử lý các doanh nghiệp mới trước khi họ tham gia đầy đủ vào luồng đăng tin và quản lý ứng viên."
      />

      {state.loading ? <SkeletonBlock lines={7} title="Đang tải hàng chờ duyệt nhà tuyển dụng..." /> : null}
      {state.feedback ? <div className="message-banner">{state.feedback}</div> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((employer) => (
                <div className="table-row admin-table-row admin-table-row--approvals" key={employer.id}>
                  <div className="table-cell">
                    <strong>{employer.companyName || employer.fullName || "Doanh nghiệp đang bổ sung thông tin"}</strong>
                    <span className="muted">{employer.email || "Chưa có email liên hệ"}</span>
                  </div>
                  <div className="table-cell">
                    <span>{employer.companySize || "Quy mô đang cập nhật"}</span>
                    <span className="muted">{employer.address || "Chưa có địa chỉ rõ ràng"}</span>
                  </div>
                  <div className="table-cell">
                    <StatusBadge value={employer.reviewStatus || "PENDING"} />
                  </div>
                  <div className="table-actions">
                    <button className="button button--primary" onClick={() => handleReview(employer.id, "APPROVED")} type="button">
                      Duyệt
                    </button>
                    <button className="button button--danger" onClick={() => handleReview(employer.id, "REJECTED")} type="button">
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState
            title="Không còn nhà tuyển dụng đang chờ"
            description="Hàng chờ hiện đã trống. Bạn có thể chuyển sang rà soát tin tuyển dụng hoặc kiểm tra danh mục."
          />
        )
      ) : null}
    </div>
  );
}
