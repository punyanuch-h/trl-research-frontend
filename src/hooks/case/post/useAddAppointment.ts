// src/hooks/case/post/useAddAppointment.ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_HOST } from "@/constant/constants";
import type { Appointment } from "@/types/case";

interface AddAppointmentData {
  case_id: string;
  date: string;
  status: "pending";
  location?: string;
  note?: string;
}

export function useAddAppointment(onSuccess: () => void, onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const addAppointment = async (appointmentData: AddAppointmentData) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_HOST}/trl/appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Server error: ${error}`);
      }

      const newAppointment = await response.json();
      
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
