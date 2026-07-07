import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
