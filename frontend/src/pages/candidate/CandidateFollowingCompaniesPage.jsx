import { useEffect, useState } from "react";

import { getFollowingCompanies, unfollowCompany } from "@/api/candidateApi";
import { CompanyCard } from "@/components/domain";
import { EmptyState, ErrorState, PageIntro, SkeletonBlock } from "@/components/ui";

export function CandidateFollowingCompaniesPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  async function load() {
    const data = await getFollowingCompanies({ page: 0, size: 20 });
    setState({ loading: false, error: "", data });
  }

  useEffect(() => {
    load().catch((error) =>
      setState({
        loading: false,
        error: error.response?.data?.message || "Không thể tải danh sách công ty đang theo dõi.",
        data: null,
      })
    );
  }, []);

  async function handleUnfollow(employerId) {
    try {
      await unfollowCompany(employerId);
      await load();
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể bỏ theo dõi công ty.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Danh sách này giúp bạn quay lại những doanh nghiệp đang quan tâm để xem vị trí mới và cập nhật hồ sơ công ty." meta="Ứng viên" title="Công ty đang theo dõi" />
      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}
      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="companies-grid">
            {state.data.content.map((company) => (
              <CompanyCard
                actions={
                  <button className="button button--danger" onClick={() => handleUnfollow(company.employerId)} type="button">
                    Bỏ theo dõi
                  </button>
                }
                company={company}
                key={company.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="Theo dõi công ty từ khu public để nhận tín hiệu tuyển dụng mới." title="Chưa theo dõi công ty nào" />
        )
      ) : null}
    </div>
  );
}
