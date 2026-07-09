import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPendingEmployers, getUsers, getJobsForReview } from "@/api/adminApi";
import { getCategories } from "@/api/categoryApi";
import { DataPanel, EmptyState, ErrorState, PageIntro, SkeletonBlock, StatCard, StatusBadge } from "@/components/ui";
import { formatCompactNumber } from "@/utils/format";

export function AdminDashboardPage() {
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
          getPendingEmployers({ page: 0, size: 5 }),
          getJobsForReview({ page: 0, size: 5 }),
          getUsers({ page: 0, size: 5 }),
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
            error: error.response?.data?.message || "Không thể tải bảng điều hành quản trị lúc này.",
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
        meta="Không gian quản trị"
        title="Tổng quan vận hành"
        description="Theo dõi những hàng chờ cần xử lý trước để khu public và khu doanh nghiệp vận hành gọn, đúng nhịp."
      />

      {state.loading ? <SkeletonBlock lines={8} title="Đang tập hợp tín hiệu vận hành..." /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <>
          <div className="stats-grid">
            <StatCard
              label="Nhà tuyển dụng chờ duyệt"
              value={formatCompactNumber(state.employers?.totalElements || 0)}
              hint="Ưu tiên xử lý sớm để doanh nghiệp mới không bị gián đoạn khi bắt đầu đăng tin."
            />
            <StatCard
              label="Tin chờ kiểm duyệt"
              value={formatCompactNumber(state.jobs?.totalElements || 0)}
              tone="accent"
              hint="Đây là nhóm nội dung đang chờ xuất hiện công khai với ứng viên."
            />
            <StatCard
              label="Người dùng đang hiển thị"
              value={formatCompactNumber(state.users?.totalElements || 0)}
              hint="Giúp nhìn nhanh quy mô tài khoản mà khu quản trị đang theo dõi."
            />
            <StatCard
              label="Danh mục hiện có"
              value={formatCompactNumber(state.categories.length)}
              hint="Taxonomy gọn và nhất quán sẽ làm cả public lẫn employer editor dễ dùng hơn."
            />
          </div>

          <div className="employer-dashboard-grid">
            <DataPanel
              title="Nhà tuyển dụng đang chờ"
              action={
                <Link className="button button--secondary" to="/admin/employer-approvals">
                  Mở hàng duyệt
                </Link>
              }
            >
              {state.employers?.content?.length ? (
                <div className="table-card">
                  {state.employers.content.map((employer) => (
                    <div className="table-row admin-table-row" key={employer.id}>
                      <div className="table-cell">
                        <strong>{employer.companyName || employer.fullName || "Doanh nghiệp đang bổ sung thông tin"}</strong>
                        <span className="muted">{employer.email || "Chưa có email liên hệ"}</span>
                      </div>
                      <div className="table-cell">
                        <StatusBadge value={employer.reviewStatus || "PENDING"} />
                      </div>
                      <div className="table-actions">
                        <Link className="button button--secondary" to="/admin/employer-approvals">
                          Xử lý
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Hàng duyệt đang trống"
                  description="Hiện không còn doanh nghiệp mới cần bạn xử lý. Đây là lúc phù hợp để rà tiếp phần tin tuyển dụng hoặc danh mục."
                />
              )}
            </DataPanel>

            <div className="stack">
              <DataPanel
                title="Tin cần rà soát"
                action={
                  <Link className="button button--secondary" to="/admin/job-moderation">
                    Duyệt tin
                  </Link>
                }
              >
                {state.jobs?.content?.length ? (
                  <div className="timeline-list">
                    {state.jobs.content.map((job) => (
                      <div className="timeline-card admin-timeline-card" key={job.id}>
                        <strong>{job.title}</strong>
                        <p className="muted">{job.employer?.companyName || "Doanh nghiệp đang bổ sung hồ sơ"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Không có tin chờ rà soát"
                    description="Khu public hiện không có tin nào cần bạn duyệt thêm ở thời điểm này."
                  />
                )}
              </DataPanel>

              <DataPanel title="Nhịp vận hành hôm nay">
                <div className="portal-auth__mini-list">
                  <div>
                    <strong>Ưu tiên các hàng chờ tác động trực tiếp đến trải nghiệm người dùng</strong>
                    <span>Doanh nghiệp mới và tin sắp lên public là hai khu vực nên xử lý trước để tránh làm chậm luồng chính.</span>
                  </div>
                  <div>
                    <strong>Giữ dữ liệu rõ ràng quan trọng hơn thêm nhiều thao tác</strong>
                    <span>Một quyết định duyệt đúng lúc, một trạng thái tài khoản nhất quán và danh mục gọn sẽ giúp toàn hệ thống dễ kiểm soát hơn.</span>
                  </div>
                </div>
              </DataPanel>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
