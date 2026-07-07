import { useEffect, useState } from "react";

import { getPendingEmployers, getUsers, getJobsForReview } from "@/api/adminApi";
import { getCategories } from "@/api/categoryApi";
import { DataPanel, ErrorState, PageIntro, SkeletonBlock, StatCard } from "@/components/ui";
import { formatCompactNumber } from "@/utils/format";

export function AdminSystemStatsPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    employers: null,
    jobs: null,
    users: null,
    categories: [],
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [employers, jobs, users, categories] = await Promise.all([
          getPendingEmployers({ page: 0, size: 100 }),
          getJobsForReview({ page: 0, size: 100 }),
          getUsers({ page: 0, size: 100 }),
          getCategories().catch(() => []),
        ]);

        if (!ignore) {
          setState({
            loading: false,
            error: "",
            employers,
            jobs,
            users,
            categories,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải thống kê hệ thống.",
            employers: null,
            jobs: null,
            users: null,
            categories: [],
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
      <PageIntro description="Màn này tổng hợp các chỉ số quản trị cốt lõi từ những endpoint hiện có, ưu tiên tính quan sát hơn là minh họa màu mè." meta="Quản trị" title="Thống kê hệ thống" />

      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <>
          <div className="stats-grid">
            <StatCard hint="Các doanh nghiệp còn chờ xử lý trong hàng duyệt." label="Nhà tuyển dụng chờ duyệt" value={formatCompactNumber(state.employers?.totalElements || 0)} />
            <StatCard hint="Khối lượng tin đang đợi moderator rà soát." label="Tin chờ kiểm duyệt" tone="accent" value={formatCompactNumber(state.jobs?.totalElements || 0)} />
            <StatCard hint="Số lượng người dùng trong tập dữ liệu admin hiện truy cập." label="Người dùng" value={formatCompactNumber(state.users?.totalElements || 0)} />
            <StatCard hint="Tổng taxonomy đang dùng cho tìm kiếm và đăng tin." label="Danh mục" value={formatCompactNumber(state.categories.length)} />
          </div>

          <div className="employer-dashboard-grid">
            <DataPanel title="Diễn giải chỉ số">
              <div className="portal-auth__mini-list">
                <div>
                  <strong>Employer approvals</strong>
                  <span>Phản ánh áp lực xác minh đầu vào của hệ thống tuyển dụng.</span>
                </div>
                <div>
                  <strong>Job moderation</strong>
                  <span>Cho thấy lượng nội dung đang chờ được phép hiển thị trên khu public.</span>
                </div>
                <div>
                  <strong>User inventory</strong>
                  <span>Giúp theo dõi quy mô tài khoản đang được admin quản trị.</span>
                </div>
              </div>
            </DataPanel>

            <DataPanel title="Ghi chú">
              <div className="candidate-form-shell__intro">
                <strong>Thống kê hiện bám theo các endpoint quản trị đang có.</strong>
                <span>Khi backend mở thêm số liệu chuyên sâu hơn, màn này có thể mở rộng tiếp mà không cần đổi layout.</span>
              </div>
            </DataPanel>
          </div>
        </>
      ) : null}
    </div>
  );
}
