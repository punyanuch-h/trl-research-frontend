import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { PostAppointmentData } from "@/types/type";

export function useCreateAppointment(onSuccess: () => void, onClose: () => void) {
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const { mutate, isPending } = useMutation({
    mutationFn: (appointmentData: PostAppointmentData) =>
      apiQueryClient.createAppointment(appointmentData),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["getAppointmentByCaseId", variables.case_id] }),
        queryClient.invalidateQueries({ queryKey: ["getAllAppointments"] }),
        queryClient.invalidateQueries({ queryKey: ["getAllCases"] }),
      ]);
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error("❌ Failed to create appointment:", error);
    },
  });

  return { createAppointment: mutate, loading: isPending };
}
