import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetUserProfile = () => {
  const apiQueryClient  = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getUserProfile"],
    queryFn: async () => {
      return apiQueryClient.useGetUserProfile();
    }
  });
};
