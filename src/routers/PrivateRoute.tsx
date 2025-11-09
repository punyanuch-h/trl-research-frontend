import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const token = localToken || sessionToken;
  if (!token) {
    return <Navigate to="/login" />;
  }

  const { data, isLoading, isError } = useGetUserProfile();
  if (isLoading) return null;
  if (isError) {
    return <Navigate to="/login" />;
  }

  return data ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
