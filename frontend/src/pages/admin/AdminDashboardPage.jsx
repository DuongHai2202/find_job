import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DataPanel, EmptyState, ErrorState, PageIntro, SkeletonBlock, StatCard, StatusBadge } from "@/components/ui";
import { getPendingEmployers, getUsers, getJobsForReview } from "@/api/adminApi";
import { getCategories } from "@/api/categoryApi";
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
            error: error.response?.data?.message || "Bảng điều hành quản trị đang tạm chưa tải được đầy đủ. Bạn thử lại sau ít phút nhé.",
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
        description="Bảng điều hành này ưu tiên quyết định vận hành: nhìn nhanh hàng chờ, xác định thứ cần duyệt trước và giữ nhịp dữ liệu toàn hệ thống ổn định."
        meta="Không gian quản trị"
        title="Tổng quan vận hành"
      />

      {state.loading ? <SkeletonBlock lines={8} title="Đang tập hợp tín hiệu vận hành toàn hệ thống..." /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <>
          <div className="stats-grid">
            <StatCard hint="Đây là hàng chờ cần chạm tới trước để không làm chậm trải nghiệm doanh nghiệp mới." label="Nhà tuyển dụng chờ duyệt" value={formatCompactNumber(state.employers?.totalElements || 0)} />
            <StatCard hint="Những tin này cần được rà lại trước khi xuất hiện công khai với ứng viên." label="Tin chờ kiểm duyệt" tone="accent" value={formatCompactNumber(state.jobs?.totalElements || 0)} />
            <StatCard hint="Con số này giúp bạn nhìn nhanh quy mô tài khoản đang đi qua hệ thống." label="Người dùng đang hiển thị" value={formatCompactNumber(state.users?.totalElements || 0)} />
            <StatCard hint="Danh mục rõ ràng giúp bề mặt nội dung của toàn hệ thống ổn định và bớt lệch nhịp." label="Danh mục hiện có" value={formatCompactNumber(state.categories.length)} />
          </div>

          <div className="employer-dashboard-grid">
            <DataPanel
              action={
                <Link className="button button--secondary" to="/admin/employer-approvals">
                  Mở hàng duyệt
                </Link>
              }
              title="Doanh nghiệp chờ duyệt"
            >
              {state.employers?.content?.length ? (
                <div className="table-card">
                  {state.employers.content.map((employer) => (
                    <div className="table-row admin-table-row" key={employer.id}>
                      <div className="table-cell">
                        <strong>{employer.companyName || employer.fullName || "Doanh nghiệp đang bổ sung thông tin"}</strong>
                        <span className="muted">{employer.email || "Chưa có email liên hệ rõ ràng"}</span>
                      </div>
                      <div className="table-cell">
                        <StatusBadge value={employer.approved ? "APPROVED" : "PENDING"} />
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
                  description="Hàng duyệt hiện đang thông thoáng. Đây là lúc tốt để kiểm tra lại các khu vực khác như tin tuyển dụng chờ rà soát hoặc chất lượng danh mục."
                  title="Không còn doanh nghiệp nào đang chờ"
                />
              )}
            </DataPanel>

            <div className="stack">
              <DataPanel
                action={
                  <Link className="button button--secondary" to="/admin/job-moderation">
                    Duyệt tin
                  </Link>
                }
                title="Tin cần rà soát"
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
                  <EmptyState description="Hiện chưa có tin nào cần bạn kiểm duyệt ngay. Hệ thống đang ở trạng thái vận hành khá ổn định ở khu vực này." title="Không có tin chờ rà soát" />
                )}
              </DataPanel>

              <DataPanel title="Nguyên tắc vận hành hôm nay">
                <div className="portal-auth__mini-list">
                  <div>
                    <strong>Ưu tiên những hàng chờ ảnh hưởng trực tiếp đến trải nghiệm người dùng</strong>
                    <span>Doanh nghiệp mới và tin sắp lên public thường là hai điểm chạm cần được xử lý sớm nhất trong ngày.</span>
                  </div>
                  <div>
                    <strong>Giữ dữ liệu rõ ràng hơn là thêm nhiều thao tác</strong>
                    <span>Một quyết định duyệt đúng lúc, một danh mục gọn và một trạng thái tài khoản nhất quán sẽ giúp toàn hệ thống bớt nhiễu hơn rất nhiều.</span>
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
