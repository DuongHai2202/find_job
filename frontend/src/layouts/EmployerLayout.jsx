import { Outlet } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { AppNavLinks } from "@/components/ui";

export function EmployerLayout() {
  const items = [
    { to: "/employer", label: "Tổng quan", end: true },
    { to: "/employer/company-profile", label: "Công ty" },
    { to: "/employer/jobs", label: "Tin tuyển dụng" },
    { to: "/employer/jobs/create", label: "Đăng tin mới" },
    { to: "/employer/applicants", label: "Ứng viên" },
  ];

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace-shell workspace-shell--employer">
        <div className="workspace-shell__inner">
          <AppNavLinks items={items} />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
