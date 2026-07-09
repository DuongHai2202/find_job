import { useEffect, useState } from "react";

import { getUsers, updateUserStatus } from "@/api/adminApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { titleizeEnum } from "@/utils/format";

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    feedback: "",
    data: null,
  });

  async function load(targetPage = page) {
    const data = await getUsers({ page: targetPage, size: 12 });
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
        const data = await getUsers({ page, size: 12 });
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
            error: error.response?.data?.message || "Không thể tải danh sách người dùng.",
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

  async function handleStatus(userId, status) {
    try {
      await updateUserStatus(userId, status);
      await load();
      setState((current) => ({
        ...current,
        feedback: status === "ACTIVE" ? "Tài khoản đã được kích hoạt." : "Tài khoản đã được khóa.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái người dùng.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro
        meta="Quản trị"
        title="Người dùng"
        description="Quản lý trạng thái tài khoản để giữ khu vực vận hành an toàn và hạn chế sai sót khi xử lý quyền truy cập."
      />

      {state.loading ? <SkeletonBlock lines={7} title="Đang tải danh sách người dùng..." /> : null}
      {state.feedback ? <div className="message-banner">{state.feedback}</div> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((account) => {
                const isCurrentAdmin = currentUser?.id === account.id;
                const lockDisabled = isCurrentAdmin || account.status === "LOCKED";
                const activateDisabled = account.status === "ACTIVE";

                return (
                  <div className="table-row admin-table-row admin-table-row--users" key={account.id}>
                    <div className="table-cell">
                      <strong>{account.fullName || account.email || "Người dùng đang cập nhật hồ sơ"}</strong>
                      <span className="muted">{account.email || "Chưa có email"}</span>
                    </div>
                    <div className="table-cell">
                      <span>{titleizeEnum(account.role)}</span>
                      {isCurrentAdmin ? <span className="muted">Tài khoản bạn đang sử dụng</span> : null}
                    </div>
                    <div className="table-cell">
                      <StatusBadge value={account.status || "ACTIVE"} />
                    </div>
                    <div className="table-actions">
                      <button
                        className="button button--secondary"
                        disabled={activateDisabled}
                        onClick={() => handleStatus(account.id, "ACTIVE")}
                        type="button"
                      >
                        Kích hoạt
                      </button>
                      <button
                        className="button button--danger"
                        disabled={lockDisabled}
                        onClick={() => handleStatus(account.id, "LOCKED")}
                        type="button"
                      >
                        Khóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState title="Không có người dùng" description="Chưa có tài khoản nào xuất hiện trong tập dữ liệu quản trị hiện tại." />
        )
      ) : null}
    </div>
  );
}
