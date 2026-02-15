import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { DashboardLayout } from "layout/Layout";
import type { UserRole } from "../../types/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  if (
    user?.role === "artist" &&
    !user?.isArtistAssociated &&
    location.pathname !== "/artist-association-required"
  ) {
    return <Navigate to="/artist-association-required" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};
