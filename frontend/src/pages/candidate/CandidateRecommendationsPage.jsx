import { useEffect, useState } from "react";

import { applyToJob, getMyResumes, saveJob } from "@/api/candidateApi";
import { getMyRecommendations } from "@/api/jobApi";
import { JobCard } from "@/components/domain";
import { EmptyState, PageIntro, SkeletonBlock } from "@/components/ui";

export function CandidateRecommendationsPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    jobs: [],
    resumes: [],
    message: "",
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [jobsData, resumes] = await Promise.all([getMyRecommendations({ page: 0, size: 10 }), getMyResumes()]);
        if (!ignore) {
          setState({
            loading: false,
            error: "",
            jobs: jobsData.content,
            resumes,
            message: "",
          });
        }
      } catch (error) {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.response?.data?.message || "Không thể tải danh sách đề xuất.",
          }));
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSave(jobId) {
    try {
      await saveJob(jobId);
      setState((current) => ({ ...current, message: "Đã lưu công việc." }));
    } catch (error) {
      setState((current) => ({ ...current, error: error.response?.data?.message || "Không thể lưu việc làm." }));
    }
  }

  async function handleQuickApply(jobId) {
    try {
      await applyToJob({
        jobId,
        resumeId: state.resumes[0]?.id || null,
        coverLetter: "Ứng viên gửi từ khu đề xuất việc làm.",
      });
      setState((current) => ({ ...current, message: "Đã gửi ứng tuyển nhanh." }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Ứng tuyển nhanh thất bại.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Đây là nơi phù hợp nhất để thao tác trong 1 đến 2 bước: xem gợi ý, lưu lại hoặc ứng tuyển nhanh bằng CV sẵn có." meta="Ứng viên" title="Việc làm đề xuất cho bạn" />
      {state.message ? <div className="message-banner">{state.message}</div> : null}
      {state.error ? <div className="message-banner message-banner--error">{state.error}</div> : null}
      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {!state.loading && !state.error ? (
        state.jobs.length ? (
          <div className="jobs-grid">
            {state.jobs.map((job) => (
              <JobCard
                actions={
                  <>
                    <button className="button button--primary" onClick={() => handleQuickApply(job.id)} type="button">
                      Ứng tuyển nhanh
                    </button>
                    <button className="button button--secondary" onClick={() => handleSave(job.id)} type="button">
                      Lưu việc
                    </button>
                  </>
                }
                job={job}
                key={job.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="Phần đề xuất phụ thuộc vào hồ sơ, CV và nguồn việc làm hiện có nên đôi lúc sẽ chưa đầy đủ." title="Chưa có đề xuất nào" />
        )
      ) : null}
    </div>
  );
}
