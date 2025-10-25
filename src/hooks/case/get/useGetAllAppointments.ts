import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetAllAppointments = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getAllAppointments"],
    queryFn: async () => {
      return apiQueryClient.useGetAllAppointments();
    }
  });
};
