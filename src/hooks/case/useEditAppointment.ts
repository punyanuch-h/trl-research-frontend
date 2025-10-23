// src/hooks/case/useEditAppointment.ts
import { useState } from "react";
import { BACKEND_HOST } from "@/constant/constants";
import type { Appointment } from "@/types/case";

export function useEditAppointment(onSave: (updated: Appointment) => void, onClose: () => void) {
  const [loading, setLoading] = useState(false);

  const editAppointment = async (form: Appointment) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_HOST}/trl/appointment/${form.appointment_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: form.appointment_id,
          case_id: form.case_id,
          date: form.date,
          status: form.status,
          location: form.location,
          summary: form.summary,
          notes: form.notes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updated = await response.json();
    onSave(updated.data || form);

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