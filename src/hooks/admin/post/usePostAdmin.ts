import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export interface PostAdminData {
  prefix: string;
  academic_position: string | null;
  first_name: string;
  last_name: string;
  department: string;
  phone_number: string;
  email: string;
  password: string;
}

export function usePostAdmin(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const postAdmin = async (data: PostAdminData) => {
    setLoading(true);
    try {
      await apiQueryClient.usePostAdmin(data);

      await queryClient.invalidateQueries({ queryKey: ["getAllAdmins"] });

      onSuccess();
    } catch (error) {
      console.error("❌ Failed to create admin:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postAdmin, loading };
}
