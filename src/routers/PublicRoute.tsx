import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { getUserRole } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const token = localToken || sessionToken;
  const role = getUserRole();
  const { data, isLoading, isError } = useGetUserProfile();

  if (!token) return <>{children}</>;

  if (isLoading) return null;

  if (isError) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return <>{children}</>;
  }

  if (data && role) {
    return <Navigate to={`/${role}/homepage`} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;