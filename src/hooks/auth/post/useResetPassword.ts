import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export interface PostResetPasswordData {
  old_password: string;
  new_password: string;
}

export function useResetPassword() {
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data: PostResetPasswordData) => apiQueryClient.resetPassword(data),
    onError: (error) => {
      console.error("❌ Failed to reset password:", error);
    },
  });

  return { postResetPassword: mutateAsync, mutate, isLoading: isPending, isError, error };
}
