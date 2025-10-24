import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetCoordinatorByCaseId = (caseId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["useGetCoordinatorByCaseId", caseId],
    queryFn: async () => {
      return apiQueryClient.useGetCoordinatorByCaseId(caseId);
    }
  });
};
