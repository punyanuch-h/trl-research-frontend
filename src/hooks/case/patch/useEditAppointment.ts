import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import type { AppointmentResponse } from "@/types/type";

export function useEditAppointment(onSave: (updated: AppointmentResponse) => void, onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const editAppointment = async (form: AppointmentResponse) => {
    setLoading(true);
    try {
      const updated = await apiQueryClient.useEditAppointment(form.id, {
        id: form.id,
        case_id: form.case_id,
        date: form.date,
        status: form.status,
        location: form.location,
        detail: form.detail,
        summary: form.summary,
      });

      // 🔄 Invalidate related queries เพื่อให้ข้อมูล sync กัน
      await queryClient.invalidateQueries({ queryKey: ["useGetAppointmentByCaseId"] });
      await queryClient.invalidateQueries({ queryKey: ["getAllAppointments"] });
      await queryClient.invalidateQueries({ queryKey: ["getAllCases"] });

      onSave(updated);
      onClose();
    } catch (err) {
      console.error("❌ Failed to update appointment:", err);
      alert("Failed to update appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { editAppointment, loading };
}