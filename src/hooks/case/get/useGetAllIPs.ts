import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAllIPs = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getAllIPs"],
    queryFn: async () => {
      return apiQueryClient.getAllIPs();
    }
  });
};
