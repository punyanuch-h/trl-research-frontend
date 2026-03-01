// src/hooks/case/post/useAddAppointment.ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { PostAppointmentData } from "@/types/type";

export function useCreateAppointment(onSuccess: () => void, onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const createAppointment = async (appointmentData: PostAppointmentData) => {
    setLoading(true);
    try {
      await apiQueryClient.createAppointment(appointmentData);

      // 🔄 Invalidate related queries เพื่อให้ข้อมูล sync กัน
      await queryClient.invalidateQueries({ queryKey: ["useGetAppointmentByCaseId"] });
      await queryClient.invalidateQueries({ queryKey: ["getAllAppointments"] });
      await queryClient.invalidateQueries({ queryKey: ["getAllCases"] });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Failed to create appointment:", error);
      throw error; // Re-throw เพื่อให้ component จัดการ error
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading };
}
