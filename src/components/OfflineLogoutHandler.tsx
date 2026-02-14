import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

export const OfflineLogoutHandler = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const performLogout = () => {
            if (localStorage.getItem("pendingLogout") === "true") {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                localStorage.removeItem("pendingLogout");
                queryClient.clear();
                toast.success("ออกจากระบบสำเร็จ เนื่องจากการเชื่อมต่อกลับมาแล้ว");
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
