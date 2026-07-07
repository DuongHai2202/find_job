import { Outlet } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { AppNavLinks } from "@/components/ui";

export function CandidateLayout() {
  const items = [
    { to: "/candidate", label: "Tổng quan", end: true },
    { to: "/candidate/profile", label: "Hồ sơ" },
    { to: "/candidate/resumes", label: "CV" },
    { to: "/candidate/applications", label: "Ứng tuyển" },
    { to: "/candidate/saved-jobs", label: "Đã lưu" },
    { to: "/candidate/recommendations", label: "Đề xuất" },
    { to: "/candidate/notifications", label: "Thông báo" },
    { to: "/candidate/following-companies", label: "Theo dõi công ty" },
  ];

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace-shell workspace-shell--candidate">
        <div className="workspace-shell__inner">
          <AppNavLinks items={items} />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
