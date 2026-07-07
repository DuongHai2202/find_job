import { useEffect, useState } from "react";

import { getUsers, updateUserStatus } from "@/api/adminApi";
import { EmptyState, ErrorState, PageIntro, Pagination, SkeletonBlock, StatusBadge } from "@/components/ui";
import { titleizeEnum } from "@/utils/format";

export function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  async function load(targetPage = page) {
    const data = await getUsers({ page: targetPage, size: 12 });
    setState({ loading: false, error: "", data });
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const data = await getUsers({ page, size: 12 });
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải danh sách người dùng.",
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

  async function handleStatus(userId, status) {
    try {
      await updateUserStatus(userId, status);
      await load();
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái người dùng.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Danh sách người dùng ưu tiên vai trò, trạng thái tài khoản và quyết định vận hành nhanh mà không thêm trang trí không cần thiết." meta="Quản trị" title="Người dùng" />

      {state.loading ? <SkeletonBlock lines={7} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="stack">
            <div className="table-card">
              {state.data.content.map((user) => (
                <div className="table-row admin-table-row admin-table-row--users" key={user.id}>
                  <div className="table-cell">
                    <strong>{user.fullName || user.email || "Người dùng đang cập nhật"}</strong>
                    <span className="muted">{user.email || "Chưa có email"}</span>
                  </div>
                  <div className="table-cell">
                    <span>{titleizeEnum(user.role)}</span>
                  </div>
                  <div className="table-cell">
                    <StatusBadge value={user.status || "ACTIVE"} />
                  </div>
                  <div className="table-actions">
                    <button className="button button--secondary" onClick={() => handleStatus(user.id, "ACTIVE")} type="button">
                      Kích hoạt
                    </button>
                    <button className="button button--danger" onClick={() => handleStatus(user.id, "LOCKED")} type="button">
                      Khóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination onPageChange={setPage} page={state.data.page} totalPages={state.data.totalPages} />
          </div>
        ) : (
          <EmptyState description="Hiện chưa có người dùng nào trong tập dữ liệu đang hiển thị." title="Không có người dùng" />
        )
      ) : null}
    </div>
  );
}
