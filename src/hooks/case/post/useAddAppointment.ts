// src/hooks/case/post/useAddAppointment.ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

interface AddAppointmentData {
  case_id: string;
  date: string;
  status: "pending";
  location?: string;
  detail?: string;
}

export function useAddAppointment(onSuccess: () => void, onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const addAppointment = async (appointmentData: AddAppointmentData) => {
    setLoading(true);
    try {
      await apiQueryClient.useAddAppointment(appointmentData);

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

  return { addAppointment, loading };
}
