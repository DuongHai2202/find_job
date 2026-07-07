import { useEffect, useState } from "react";

import { getSavedJobs, removeSavedJob } from "@/api/candidateApi";
import { JobCard } from "@/components/domain";
import { EmptyState, ErrorState, PageIntro, SkeletonBlock } from "@/components/ui";

export function CandidateSavedJobsPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  async function load() {
    const data = await getSavedJobs({ page: 0, size: 12 });
    setState({ loading: false, error: "", data });
  }

  useEffect(() => {
    load().catch((error) =>
      setState({
        loading: false,
        error: error.response?.data?.message || "Không thể tải việc làm đã lưu.",
        data: null,
      })
    );
  }, []);

  async function handleRemove(jobId) {
    try {
      await removeSavedJob(jobId);
      await load();
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể bỏ lưu việc làm.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Những công việc bạn lưu từ khu public sẽ được gom về đây để quay lại so sánh và ứng tuyển." meta="Ứng viên" title="Việc làm đã lưu" />
      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}
      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="jobs-grid">
            {state.data.content.map((item) => (
              <JobCard
                actions={
                  <button className="button button--danger" onClick={() => handleRemove(item.job.id)} type="button">
                    Bỏ lưu
                  </button>
                }
                job={item.job}
                key={item.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="Khi lưu việc làm từ trang chi tiết hoặc danh sách, chúng sẽ xuất hiện tại đây." title="Chưa có việc đã lưu" />
        )
      ) : null}
    </div>
  );
}
