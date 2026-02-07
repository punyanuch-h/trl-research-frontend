import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { AppointmentResponse } from "@/hooks/client/type";

export const useMarkAsRead = () => {
    const apiQueryClient = new ApiQueryClient(
        import.meta.env.VITE_PUBLIC_API_URL
    );
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiQueryClient.useMarkAppointmentAsRead(id),
        // Optimistic UI update
        onMutate: async (id: string) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["notifications"] });

            // Snapshot the previous value
            const previousNotifications = queryClient.getQueryData<AppointmentResponse[]>(["notifications"]);

            // Optimistically update to the new value
            if (previousNotifications) {
                queryClient.setQueryData<AppointmentResponse[]>(
                    ["notifications"],
                    previousNotifications.map((notif) =>
                        notif.id === id ? { ...notif, is_read: true } : notif
                    )
                );
            }

            // Return a context object with the snapshotted value
            return { previousNotifications };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _id, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications);
            }
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
