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
      <PageIntro
        meta="Quản trị"
        title="Thống kê hệ thống"
        description="Theo dõi các chỉ số đang có thật từ backend để nắm nhanh áp lực vận hành và độ đầy dữ liệu."
      />

      {state.loading ? <SkeletonBlock lines={6} title="Đang tổng hợp thống kê hệ thống..." /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <>
          <div className="stats-grid">
            <StatCard
              label="Nhà tuyển dụng chờ duyệt"
              value={formatCompactNumber(state.employers?.totalElements || 0)}
              hint="Số doanh nghiệp đang chờ quyết định từ admin."
            />
            <StatCard
              label="Tin chờ kiểm duyệt"
              value={formatCompactNumber(state.jobs?.totalElements || 0)}
              tone="accent"
              hint="Khối lượng nội dung đang chờ hiển thị công khai."
            />
            <StatCard
              label="Người dùng"
              value={formatCompactNumber(state.users?.totalElements || 0)}
              hint="Tổng số tài khoản hiện được khu quản trị truy cập."
            />
            <StatCard
              label="Danh mục"
              value={formatCompactNumber(state.categories.length)}
              hint="Số danh mục đang dùng để điều hướng và phân loại tin."
            />
          </div>

          <div className="employer-dashboard-grid">
            <DataPanel title="Cách đọc các chỉ số">
              <div className="portal-auth__mini-list">
                <div>
                  <strong>Nhà tuyển dụng chờ duyệt</strong>
                  <span>Phản ánh lượng hồ sơ doanh nghiệp mới mà admin cần xử lý để không làm chậm đầu vào hệ thống.</span>
                </div>
                <div>
                  <strong>Tin chờ kiểm duyệt</strong>
                  <span>Cho thấy khối lượng nội dung đang đợi xuất hiện trên khu public và cần được kiểm tra trước.</span>
                </div>
                <div>
                  <strong>Người dùng và danh mục</strong>
                  <span>Hai nhóm số liệu này giúp bạn theo dõi quy mô dữ liệu và độ ổn định của taxonomy hiện tại.</span>
                </div>
              </div>
            </DataPanel>

            <DataPanel title="Lưu ý vận hành">
              <div className="candidate-form-shell__intro">
                <strong>Trang này chỉ hiển thị các số liệu đang có endpoint thật.</strong>
                <span>Khi backend có thêm dữ liệu chuyên sâu hơn, bảng thống kê có thể mở rộng tiếp mà vẫn giữ nguyên hệ giao diện hiện tại.</span>
              </div>
            </DataPanel>
          </div>
        </>
      ) : null}
    </div>
  );
}
