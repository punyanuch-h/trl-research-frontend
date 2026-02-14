import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

export const OfflineLogoutHandler = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const performLogout = () => {
            if (localStorage.getItem("pendingLogout") === "true") {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                localStorage.removeItem("pendingLogout");
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
    }, [navigate]);

    return null;
};
