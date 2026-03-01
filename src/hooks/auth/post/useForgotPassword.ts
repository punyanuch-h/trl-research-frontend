import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useForgotPassword = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useMutation({
    mutationFn: async (email: string) => {
      return apiQueryClient.forgotPassword(email);
    },
    onSuccess: (data) => {
      console.log("Password reset email sent successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to send password reset email:", error);
    },
  });
};
