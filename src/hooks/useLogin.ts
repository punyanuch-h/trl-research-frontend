import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useLogin = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return apiQueryClient.useLogin(email, password);
    },
  });
};
