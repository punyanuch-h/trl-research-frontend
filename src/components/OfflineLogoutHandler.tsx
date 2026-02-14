import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

export const OfflineLogoutHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = () => {
            if (localStorage.getItem("pendingLogout") === "true") {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                localStorage.removeItem("pendingLogout");
                toast.success("Internet is back. Logged out successfully");
                navigate("/");
            }
        };

        // Check on mount if we are online and have a pending logout
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
