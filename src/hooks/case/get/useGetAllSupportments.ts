import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAllSupportments = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getAllSupportments"],
    queryFn: async () => {
      return apiQueryClient.getAllSupportments();
    }
  });
};
