import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUserProfile } from "@/hooks/index";
import { getUserRole, isAuthenticated, logout } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();
  const { data, isLoading, isError } = useGetUserProfile();

  if (!isAuth) return <>{children}</>;

  if (isLoading) return null;

  if (isError) {
    logout();
    return <>{children}</>;
  }

  if (data && role) {
    return <Navigate to={`/${role}/homepage`} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;