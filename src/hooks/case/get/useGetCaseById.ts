import { useQuery } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useGetCaseById = (caseId: string) => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useQuery({
    queryKey: ["getCaseById", caseId],
    queryFn: async () => {
      return apiQueryClient.useGetCaseById(caseId);
    },
    enabled: !!caseId
  });
};
