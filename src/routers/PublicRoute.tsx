import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";

interface Props {
  children: React.ReactNode;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    const token = localToken || sessionToken;
    if (!token) return <>{children}</>;

    const { data, isLoading, isError } = useGetUserProfile();
    if (isLoading) return null;
    if (isError) return <>{children}</>;

    return data ? <Navigate to="/dashboard" /> : <>{children}</>;
};

export default PublicRoute;