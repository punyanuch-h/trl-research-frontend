import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetSupporterByCaseId = (caseId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["useGetSupporterByCaseId", caseId],
    queryFn: async () => {
      return apiQueryClient.useGetSupporterByCaseId(caseId);
    }
  });
};
