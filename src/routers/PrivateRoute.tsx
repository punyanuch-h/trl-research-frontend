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
  const { data, isLoading, isError } = useGetUserProfile();
  if (!token) {
    console.log("No token found");
    return <Navigate to="/login" />;
  }

  if (isLoading) return null;
  if (isError) {
    console.log("Error fetching user profile");
    return <Navigate to="/login" />;
  }

  return data ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
