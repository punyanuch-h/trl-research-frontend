import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import type { AppointmentResponse } from "@/types/type";

export function useUpdateAppointment(onSave: (updated: AppointmentResponse) => void, onClose: () => void) {
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const { mutate, isPending } = useMutation({
    mutationFn: (form: AppointmentResponse) => 
      apiQueryClient.updateAppointment(form.id, {
        id: form.id,
        case_id: form.case_id,
        date: form.date,
        status: form.status,
        location: form.location,
        detail: form.detail,
        summary: form.summary,
      }),
    onSuccess: async (updated, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["getAppointmentByCaseId", variables.case_id] }),
        queryClient.invalidateQueries({ queryKey: ["getAllAppointments"] }),
        queryClient.invalidateQueries({ queryKey: ["getAllCases"] }),
      ]);
      onSave(updated);
      onClose();
    },
  });

  return { updateAppointment: mutate, loading: isPending };
}
