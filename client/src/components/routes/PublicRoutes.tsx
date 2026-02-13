import { Navigate } from "react-router-dom";

import { useAuth } from "contexts/AuthContext";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
