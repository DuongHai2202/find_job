import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DataPanel, EmptyState, ErrorState, PageIntro, SkeletonBlock, StatCard, StatusBadge } from "@/components/ui";
import { getNaturalFallback } from "@/content/siteCopy";
import { getEmployerApplications, getEmployerJobs, getMyEmployerProfile } from "@/api/employerApi";
import { formatCompactNumber, formatDateTime } from "@/utils/format";

export function EmployerDashboardPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    profile: null,
    jobs: null,
    applications: null,
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [profile, jobs, applications] = await Promise.all([
          getMyEmployerProfile(),
          getEmployerJobs({ page: 0, size: 5 }),
          getEmployerApplications({ page: 0, size: 6 }),
        ]);

        if (!ignore) {
          setState({
            loading: false,
            error: "",
            profile,
            jobs,
            applications,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Bảng điều phối tuyển dụng đang tạm chậm nhịp. Bạn thử tải lại sau một chút nhé.",
            profile: null,
            jobs: null,
            applications: null,
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const activeJobs = state.jobs?.content?.filter((job) => job.status === "APPROVED").length || 0;
  const totalApplicants = state.applications?.totalElements || 0;

  return (
    <div className="stack">
      <PageIntro
        description="Đây là bàn điều phối tuyển dụng dành cho đội ngũ của bạn: theo dõi tin đang mở, xem hồ sơ mới và xử lý các điểm cần ưu tiên trong một nhịp đọc ngắn gọn."
        meta="Không gian nhà tuyển dụng"
        title={state.profile?.companyName || "Tổng quan tuyển dụng"}
      />

      {state.loading ? <SkeletonBlock lines={8} title="Đang chuẩn bị bảng điều phối tuyển dụng..." /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <>
          <div className="stats-grid">
            <StatCard hint="Đây là những vị trí đang thật sự hiển thị với ứng viên và cần được theo dõi sát." label="Tin đang hoạt động" tone="accent" value={formatCompactNumber(activeJobs)} />
            <StatCard hint="Bao gồm mọi hồ sơ đã đi vào luồng xử lý, từ mới nhận đến đang phỏng vấn." label="Tổng lượt ứng tuyển" value={formatCompactNumber(totalApplicants)} />
            <StatCard hint="Một hồ sơ công ty đầy đủ sẽ giúp tin tuyển dụng được tin tưởng hơn ngay từ lần đọc đầu tiên." label="Hồ sơ doanh nghiệp" value={state.profile?.companyDescription ? "Đã có nền tốt" : "Nên bổ sung thêm"} />
            <StatCard hint="Bạn có thể đăng tin mới, cập nhật hồ sơ công ty hoặc quay lại xử lý ứng viên ngay từ dashboard này." label="Nhịp thao tác" tone="warning" value="Sẵn sàng" />
          </div>

          <div className="employer-dashboard-grid">
            <DataPanel
              action={
                <Link className="button button--secondary" to="/employer/jobs">
                  Xem tất cả tin
                </Link>
              }
              description="Danh sách này giúp bạn nhìn nhanh những vị trí cần chăm sóc tiếp: đang mở, đang chờ duyệt hay cần chỉnh sửa thêm."
              title="Tin tuyển dụng gần đây"
            >
              {state.jobs?.content?.length ? (
                <div className="table-card">
                  {state.jobs.content.map((job) => (
                    <div className="table-row employer-table-row" key={job.id}>
                      <div className="table-cell">
                        <strong>{job.title}</strong>
                        <span className="muted">{job.location || "Linh hoạt địa điểm"}</span>
                      </div>
                      <div className="table-cell">
                        <StatusBadge value={job.status} />
                      </div>
                      <div className="table-cell">
                        <span>{formatCompactNumber(job.applicationCount || 0)} hồ sơ</span>
                      </div>
                      <div className="table-actions">
                        <Link className="button button--secondary" to={`/employer/jobs/${job.id}/edit`}>
                          Chỉnh sửa
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="Bắt đầu từ một tin tuyển dụng đầu tiên. Chỉ cần mô tả đủ rõ công việc, quyền lợi và bối cảnh đội ngũ, bạn sẽ có nền tảng tốt để thu hút đúng ứng viên."
                  title="Bạn chưa có tin tuyển dụng nào"
                />
              )}
            </DataPanel>

            <div className="stack">
              <DataPanel
                action={
                  <Link className="button button--secondary" to="/employer/applicants">
                    Xem ứng viên
                  </Link>
                }
                title="Ứng viên mới cập nhật"
              >
                {state.applications?.content?.length ? (
                  <div className="timeline-list">
                    {state.applications.content.slice(0, 4).map((application) => (
                      <div className="timeline-card" key={application.id}>
                        <div className="meta-row">
                          <StatusBadge value={application.status} />
                          <span className="muted">{formatDateTime(application.updatedAt)}</span>
                        </div>
                        <strong>{application.candidate?.fullName || application.candidateName || "Ứng viên đang bổ sung hồ sơ"}</strong>
                        <p className="muted">{application.job?.title || "Vị trí đang được cập nhật lại"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState description={getNaturalFallback("noApplicants")} title="Chưa có ứng viên mới" />
                )}
              </DataPanel>

              <DataPanel title="Tác vụ nên làm tiếp">
                <div className="portal-auth__mini-list">
                  <div>
                    <strong>Hoàn thiện hồ sơ công ty</strong>
                    <span>Một mô tả rõ ràng về doanh nghiệp và cách làm việc sẽ giúp ứng viên tin hơn ngay cả trước khi họ bấm ứng tuyển.</span>
                  </div>
                  <div>
                    <strong>Rà lại những tin đang chờ duyệt</strong>
                    <span>Chỉ cần chỉnh vài điểm mấu chốt như quyền lợi, yêu cầu và tiêu đề, bạn đã có thể tăng chất lượng hiển thị công khai đáng kể.</span>
                  </div>
                </div>
                <div className="button-row">
                  <Link className="button button--primary" to="/employer/jobs/create">
                    Đăng tin mới
                  </Link>
                  <Link className="button button--secondary" to="/employer/company-profile">
                    Cập nhật hồ sơ công ty
                  </Link>
                </div>
              </DataPanel>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
