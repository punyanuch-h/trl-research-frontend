import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import { getUserRole } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
  allowRoles?: string[];
}

const PrivateRoute: React.FC<Props> = ({ children, allowRoles }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const token = localToken || sessionToken;
  const { data, isLoading, isError } = useGetUserProfile();
  const role = getUserRole();
  if (!token) {
    console.log("No token found");
    return <Navigate to="/login" />;
  }

  if (isLoading) return null;
  if (isError) {
    console.log("Error fetching user profile");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && (!role || !allowRoles.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  return data ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
