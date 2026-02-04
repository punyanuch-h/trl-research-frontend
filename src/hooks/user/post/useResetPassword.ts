import { useState } from "react";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export interface PostResetPasswordData {
  old_password: string;
  new_password: string;
}

export function usePostResetPassword(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const postResetPassword = async (data: PostResetPasswordData) => {
    setLoading(true);
    try {
      await apiQueryClient.useResetPassword(data);
      onSuccess();
    } catch (error) {
      console.error("❌ Failed to reset password:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postResetPassword, loading };
}
