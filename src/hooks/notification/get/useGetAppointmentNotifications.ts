import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAppointmentNotifications = () => {
    const apiQueryClient = new ApiQueryClient(
        import.meta.env.VITE_PUBLIC_API_URL
    );

    const token = localStorage.getItem("token");

    return useQuery({
        queryKey: ["getAppointmentNotifications", token],
        queryFn: async () => {
            const response = await apiQueryClient.getAppointmentNotifications();
            return response;
        },
        // Refresh every 1 minute to check for new notifications
        refetchInterval: 60000,
        enabled: !!token,
    });
};
