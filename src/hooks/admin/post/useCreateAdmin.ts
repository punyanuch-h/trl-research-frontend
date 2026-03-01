import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { PostAdminData } from "@/types/type";

export function useCreateAdmin(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const createAdmin = async (data: PostAdminData) => {
    setLoading(true);
    try {
      await apiQueryClient.createAdmin(data);

      await queryClient.invalidateQueries({ queryKey: ["getAllAdmins"] });

      onSuccess();
    } catch (error) {
      console.error("❌ Failed to create admin:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createAdmin, loading };
}
