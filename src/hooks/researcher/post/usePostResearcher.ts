import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

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
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const postResearcher = async (data: PostResearcherData) => {
    setLoading(true);
    try {
      await apiQueryClient.usePostResearcher(data);

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
