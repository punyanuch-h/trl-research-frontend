import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/auth";

export const OfflineLogoutHandler = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    useEffect(() => {
        const performLogout = () => {
            if (localStorage.getItem("pendingLogout") === "true") {
                logout();
                queryClient.clear();
                toast.success(t("auth.logoutSuccess"));
                navigate("/");
            }
        };

        if (navigator.onLine) {
            performLogout();
        }

        const handleOnline = () => {
            performLogout();
        };

        window.addEventListener("online", handleOnline);
        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, [navigate, queryClient, t]);

    return null;
};
