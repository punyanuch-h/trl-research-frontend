import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_HOST } from "@/constant/constants";
import type { AppointmentResponse } from "@/hooks/client/type";

export function useEditAppointment(onSave: (updated: AppointmentResponse) => void, onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const editAppointment = async (form: AppointmentResponse) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_HOST}/trl/appointment/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          case_id: form.case_id,
          date: form.date,
          status: form.status,
          location: form.location,
          detail: form.detail,
          summary: form.summary,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updated = await response.json();

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