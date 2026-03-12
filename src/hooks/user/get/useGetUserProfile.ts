import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";
import { getToken } from "@/lib/auth";

export const useGetUserProfile = () => {
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const token = getToken();

  return useQuery({
    queryKey: ["getUserProfile"],
    queryFn: () => apiQueryClient.getUserProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token,
  });
};