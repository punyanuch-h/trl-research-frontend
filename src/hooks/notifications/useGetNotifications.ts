import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetNotifications = () => {
    const apiQueryClient = new ApiQueryClient(
        import.meta.env.VITE_PUBLIC_API_URL
    );

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await apiQueryClient.useGetNotificationAppointments();
            // The API response is { data: AppointmentResponse[], unread_count: number }
            return response.data || [];
        },
        // Refresh every 1 minute to check for new notifications
        refetchInterval: 60000,
    });
};
