import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetUserProfile } from "@/hooks/index";
import { getUserRole, isAuthenticated, logout } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
  allowRoles?: string[];
}

const PrivateRoute: React.FC<Props> = ({ children, allowRoles }) => {
  const isAuth = isAuthenticated();
  const { data, isLoading, isError } = useGetUserProfile();
  const role = getUserRole();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // If we are authenticated but the profile is still loading, 
  // it might be because a silent refresh is in progress.
  if (isLoading) return null;

  if (isError) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if ((data as { is_temp?: boolean })?.is_temp && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" state={{ isTemp: true }} replace />;
  }

  if (allowRoles && (!role || !allowRoles.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  return data ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
