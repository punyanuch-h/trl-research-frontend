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
    if (role === "admin") return <Navigate to="/admin/homepage" />;
    else if (role === "researcher") return <Navigate to="/researcher/homepage" />;
    if (!token) return <>{children}</>;

    if (isLoading) return null;
    if (isError) return <>{children}</>;

    return data ? <Navigate to={`/${role}/homepage`} /> : <>{children}</>;
};

export default PublicRoute;