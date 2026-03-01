import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { PostResearcherData } from "@/types/type";

export function useCreateResearcher(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const createResearcher = async (data: PostResearcherData) => {
    setLoading(true);
    try {
      await apiQueryClient.createResearcher(data);

      await queryClient.invalidateQueries({ queryKey: ["getAllResearchers"] });

      onSuccess();
    } catch (error) {
      console.error("❌ Failed to create researcher:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createResearcher, loading };
}
