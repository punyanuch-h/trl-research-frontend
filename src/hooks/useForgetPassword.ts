import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useForgetPassword = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useMutation({
    mutationFn: async (email: string) => {
      return apiQueryClient.useForgetPassword(email);
    },
    onSuccess: (data) => {
      console.log("Password reset email sent successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to send password reset email:", error);
    },
  });
};
