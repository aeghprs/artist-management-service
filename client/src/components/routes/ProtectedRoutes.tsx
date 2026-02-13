import { Navigate } from "react-router-dom";


import { DashboardLayout } from "layout/layout";
import { useAuth } from "contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <DashboardLayout>{children}</DashboardLayout>;
};