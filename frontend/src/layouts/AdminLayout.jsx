import { Outlet } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { AppNavLinks } from "@/components/ui";

export function AdminLayout() {
  const items = [
    { to: "/admin", label: "Tổng quan", end: true },
    { to: "/admin/employer-approvals", label: "Duyệt nhà tuyển dụng" },
    { to: "/admin/job-moderation", label: "Duyệt tin" },
    { to: "/admin/users", label: "Người dùng" },
    { to: "/admin/categories", label: "Danh mục" },
    { to: "/admin/system-stats", label: "Thống kê" },
  ];

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="workspace-shell workspace-shell--admin">
        <div className="workspace-shell__inner">
          <AppNavLinks items={items} />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
