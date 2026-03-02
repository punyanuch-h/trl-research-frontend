import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { NotificationListResponse } from "@/types/type";

export const useMarkAllAppointmentNotificationsAsRead = () => {
    const apiQueryClient = new ApiQueryClient(
        import.meta.env.VITE_PUBLIC_API_URL
    );
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => apiQueryClient.markAllAppointmentNotificationsAsRead(),
        // Optimistic UI update
        onMutate: async () => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["getAppointmentNotifications"] });

            // Snapshot the previous value
            const previousNotifications = queryClient.getQueryData<NotificationListResponse>(["getAppointmentNotifications"]);

            // Optimistically update to the new value
            if (previousNotifications) {
                queryClient.setQueryData<NotificationListResponse>(
                    ["getAppointmentNotifications"],
                    {
                        ...previousNotifications,
                        unread_count: 0,
                        data: previousNotifications.data.map((notif) => ({ ...notif, is_read: true }))
                    }
                );
            }

            // Return a context object with the snapshotted value
            return { previousNotifications };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["getAppointmentNotifications"], context.previousNotifications);
            }
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["getAppointmentNotifications"] });
        },
    });
};
