import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_HOST } from "@/constant/constants";

export interface PostResearcherData {
  prefix: string;
  academic_position: string | null;
  first_name: string;
  last_name: string;
  department: string;
  phone_number: string;
  email: string;
  password: string;
}

export function usePostResearcher(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const postResearcher = async (data: PostResearcherData) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_HOST}/trl/researcher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "สมัครสมาชิกไม่สำเร็จ");
      }

      await queryClient.invalidateQueries({ queryKey: ["getAllResearchers"] });

      onSuccess();
    } catch (error) {
      console.error("❌ Failed to create researcher:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postResearcher, loading };
}
