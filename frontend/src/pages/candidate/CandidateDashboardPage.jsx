import { useEffect, useState } from "react";

import { getMyApplications, getMyCandidateProfile, getMyResumes, getSavedJobs } from "@/api/candidateApi";
import { JobCard } from "@/components/domain";
import { DataPanel, EmptyState, ErrorState, PageIntro, SkeletonBlock, StatCard } from "@/components/ui";
import { getNaturalFallback } from "@/content/siteCopy";
import { getUnreadNotificationCount } from "@/api/notificationApi";
import { getMyRecommendations } from "@/api/jobApi";
import { formatCompactNumber, titleizeEnum } from "@/utils/format";

export function CandidateDashboardPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    profile: null,
    resumes: [],
    applications: null,
    recommendations: null,
    savedJobs: null,
    unreadCount: 0,
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [profile, resumes, applications, recommendations, savedJobs, unreadCount] = await Promise.all([
          getMyCandidateProfile(),
          getMyResumes(),
          getMyApplications({ page: 0, size: 5 }),
          getMyRecommendations({ page: 0, size: 4 }),
          getSavedJobs({ page: 0, size: 4 }),
          getUnreadNotificationCount(),
        ]);

        if (!ignore) {
          setState({
            loading: false,
            error: "",
            profile,
            resumes,
            applications,
            recommendations,
            savedJobs,
            unreadCount,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.response?.data?.message || "Không gian ứng viên đang tạm chậm nhịp. Bạn thử tải lại sau một chút nhé.",
          }));
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const completionItems = [state.profile?.headline ? 1 : 0, state.profile?.summary ? 1 : 0, state.profile?.address ? 1 : 0, state.resumes.length ? 1 : 0];
  const completionPercent = Math.round((completionItems.reduce((sum, item) => sum + item, 0) / completionItems.length) * 100);

  return (
    <div className="stack">
      <PageIntro
        description="Đây là nơi bạn nhìn nhanh toàn bộ hành trình tìm việc của mình: hồ sơ, CV, việc đã lưu, đơn đã gửi và những cơ hội nên xem tiếp."
        meta="Không gian ứng viên"
        title={`Chào ${state.profile?.fullName || "bạn"}, mình bắt đầu từ đâu hôm nay?`}
      />

      {state.loading ? <SkeletonBlock lines={8} title="Đang chuẩn bị không gian ứng tuyển của bạn..." /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <>
          <div className="stats-grid">
            <StatCard hint="Một hồ sơ đủ rõ sẽ giúp hệ thống gợi ý việc sát hơn và nhà tuyển dụng dễ hiểu bạn hơn." label="Mức độ hoàn thiện hồ sơ" tone="accent" value={`${completionPercent}%`} />
            <StatCard hint="Càng có CV rõ ràng, bạn càng dễ ứng tuyển nhanh khi gặp vị trí phù hợp." label="CV hiện có" value={formatCompactNumber(state.resumes.length)} />
            <StatCard hint="Mọi cập nhật về trạng thái hồ sơ sẽ dần tập trung về đây để bạn không bỏ lỡ nhịp phản hồi." label="Đơn đã ứng tuyển" value={formatCompactNumber(state.applications?.totalElements || 0)} />
            <StatCard hint="Thông báo mới thường là tín hiệu quan trọng từ doanh nghiệp hoặc từ các vị trí mới đáng quan tâm." label="Thông báo chưa đọc" tone="warning" value={formatCompactNumber(state.unreadCount)} />
          </div>

          <div className="candidate-dashboard-grid">
            <DataPanel
              description="Các gợi ý ở đây dựa trên hồ sơ hiện có, CV bạn đã tạo và nhóm việc làm đang được công khai. Càng hoàn thiện hồ sơ, độ phù hợp càng cao."
              title="Việc làm nên xem tiếp"
            >
              {state.recommendations?.content?.length ? (
                <div className="list">
                  {state.recommendations.content.map((job) => (
                    <JobCard job={job} key={job.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="Bạn thử bổ sung headline nghề nghiệp, phần tóm tắt và ít nhất một CV để phần gợi ý bắt đầu sát hơn với nhu cầu thực tế."
                  title="Chưa có gợi ý thật sự phù hợp"
                />
              )}
            </DataPanel>

            <div className="stack">
              <DataPanel title="Tiến độ gần đây">
                {state.applications?.content?.length ? (
                  <div className="timeline-list">
                    {state.applications.content.map((application) => (
                      <div className="timeline-card" key={application.id}>
                        <strong>{application.job?.title}</strong>
                        <p className="muted">
                          {application.job?.employer?.companyName || "Doanh nghiệp đang hoàn thiện hồ sơ"} • {titleizeEnum(application.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState description={getNaturalFallback("noApplications")} title="Bạn chưa có đơn ứng tuyển nào" />
                )}
              </DataPanel>

              <DataPanel title="Việc làm đã lưu">
                {state.savedJobs?.content?.length ? (
                  <div className="timeline-list">
                    {state.savedJobs.content.map((item) => (
                      <div className="timeline-card" key={item.id}>
                        <strong>{item.job?.title}</strong>
                        <p className="muted">{item.job?.location || "Linh hoạt địa điểm"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState description={getNaturalFallback("noSavedJobs")} title="Bạn chưa lưu vị trí nào" />
                )}
              </DataPanel>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
