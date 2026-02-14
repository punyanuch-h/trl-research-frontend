import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetUserProfile = () => {
  const apiQueryClient = new ApiQueryClient(import.meta.env.VITE_PUBLIC_API_URL);
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["getUserProfile", token],
    queryFn: async () => {
      const userProfile = await apiQueryClient.useGetUserProfile();
      return userProfile;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};