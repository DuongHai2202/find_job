import { createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { CandidateLayout } from "@/layouts/CandidateLayout";
import { EmployerLayout } from "@/layouts/EmployerLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { AdminEmployerApprovalsPage } from "@/pages/admin/AdminEmployerApprovalsPage";
import { AdminJobModerationPage } from "@/pages/admin/AdminJobModerationPage";
import { AdminSystemStatsPage } from "@/pages/admin/AdminSystemStatsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { CandidateApplicationsPage } from "@/pages/candidate/CandidateApplicationsPage";
import { CandidateDashboardPage } from "@/pages/candidate/CandidateDashboardPage";
import { CandidateFollowingCompaniesPage } from "@/pages/candidate/CandidateFollowingCompaniesPage";
import { CandidateNotificationsPage } from "@/pages/candidate/CandidateNotificationsPage";
import { CandidateProfilePage } from "@/pages/candidate/CandidateProfilePage";
import { CandidateRecommendationsPage } from "@/pages/candidate/CandidateRecommendationsPage";
import { CandidateResumesPage } from "@/pages/candidate/CandidateResumesPage";
import { CandidateSavedJobsPage } from "@/pages/candidate/CandidateSavedJobsPage";
import { EmployerApplicantsPage } from "@/pages/employer/EmployerApplicantsPage";
import { EmployerApplicationDetailPage } from "@/pages/employer/EmployerApplicationDetailPage";
import { EmployerCompanyProfilePage } from "@/pages/employer/EmployerCompanyProfilePage";
import { EmployerDashboardPage } from "@/pages/employer/EmployerDashboardPage";
import { EmployerJobEditorPage } from "@/pages/employer/EmployerJobEditorPage";
import { EmployerJobsPage } from "@/pages/employer/EmployerJobsPage";
import { CompanyDetailPage } from "@/pages/public/CompanyDetailPage";
import { CompaniesPage } from "@/pages/public/CompaniesPage";
import { EmployerLandingPage } from "@/pages/public/EmployerLandingPage";
import { HomePage } from "@/pages/public/HomePage";
import { JobDetailPage } from "@/pages/public/JobDetailPage";
import { JobsPage } from "@/pages/public/JobsPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { RegisterPage } from "@/pages/public/RegisterPage";
import { NotFoundPage } from "@/pages/shared/NotFoundPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "jobs", element: <JobsPage /> },
      { path: "jobs/:jobId", element: <JobDetailPage /> },
      { path: "companies", element: <CompaniesPage /> },
      { path: "companies/:companyId", element: <CompanyDetailPage /> },
      { path: "employers", element: <EmployerLandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["CANDIDATE"]} />,
    children: [
      {
        path: "/candidate",
        element: <CandidateLayout />,
        children: [
          { index: true, element: <CandidateDashboardPage /> },
          { path: "profile", element: <CandidateProfilePage /> },
          { path: "resumes", element: <CandidateResumesPage /> },
          { path: "applications", element: <CandidateApplicationsPage /> },
          { path: "saved-jobs", element: <CandidateSavedJobsPage /> },
          { path: "recommendations", element: <CandidateRecommendationsPage /> },
          { path: "notifications", element: <CandidateNotificationsPage /> },
          { path: "following-companies", element: <CandidateFollowingCompaniesPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["EMPLOYER"]} />,
    children: [
      {
        path: "/employer",
        element: <EmployerLayout />,
        children: [
          { index: true, element: <EmployerDashboardPage /> },
          { path: "company-profile", element: <EmployerCompanyProfilePage /> },
          { path: "jobs", element: <EmployerJobsPage /> },
          { path: "jobs/create", element: <EmployerJobEditorPage mode="create" /> },
          { path: "jobs/:jobId/edit", element: <EmployerJobEditorPage mode="edit" /> },
          { path: "applicants", element: <EmployerApplicantsPage /> },
          { path: "applications/:applicationId", element: <EmployerApplicationDetailPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "employer-approvals", element: <AdminEmployerApprovalsPage /> },
          { path: "job-moderation", element: <AdminJobModerationPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "system-stats", element: <AdminSystemStatsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
