import { useEffect, useState } from "react";

import { getCategories } from "@/api/categoryApi";
import { DataPanel, EmptyState, ErrorState, PageIntro, SkeletonBlock } from "@/components/ui";
import { formatCompactNumber } from "@/utils/format";

export function AdminCategoriesPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: [],
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getCategories();
        if (!ignore) {
          setState({ loading: false, error: "", data });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải danh mục.",
            data: [],
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="stack">
      <PageIntro description="Hiện tại màn này đóng vai trò inventory rõ ràng cho taxonomy của hệ thống, sẵn sàng để gắn CRUD khi backend mở thêm endpoint." meta="Quản trị" title="Danh mục" />

      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        state.data.length ? (
          <div className="employer-dashboard-grid">
            <DataPanel title={`Danh sách danh mục (${formatCompactNumber(state.data.length)})`}>
              <div className="timeline-list">
                {state.data.map((category) => (
                  <div className="timeline-card admin-timeline-card" key={category.id}>
                    <strong>{category.name}</strong>
                    <p className="muted">Mã danh mục: {category.id}</p>
                  </div>
                ))}
              </div>
            </DataPanel>

            <DataPanel title="Ghi chú vận hành">
              <div className="portal-auth__mini-list">
                <div>
                  <strong>Chưa có endpoint CRUD</strong>
                  <span>Màn hiện tại ưu tiên làm rõ inventory và cấu trúc hiển thị để sẵn sàng nối tiếp khi backend mở rộng.</span>
                </div>
                <div>
                  <strong>Giữ taxonomy ổn định</strong>
                  <span>Danh mục ảnh hưởng trực tiếp đến public discovery, employer editor và báo cáo hệ thống.</span>
                </div>
              </div>
            </DataPanel>
          </div>
        ) : (
          <EmptyState description="Hiện chưa có danh mục nào trong hệ thống." title="Không có danh mục" />
        )
      ) : null}
    </div>
  );
}
